import React from 'react';
import Layout from '../components/Layout';
import Networks from '../config/networks.json'
import useWallet, {request, CONNECTED, CONNECTING, ZERO, toEther, fromEther} from '../useWallet';
/* import { getApiUrl } from '../util'; */

const networks = Networks as {[chain:string]:NetworkTypes}

interface HomeStatus {
	query: string
	submitLabel: string
	loading:boolean
}


const Home = () => {
	const G = useWallet();
	const L = G.L;
	const refMenu = React.useRef<HTMLUListElement>(null)
	const refList = React.useRef<HTMLInputElement>(null)
	const refAmount = React.useRef<HTMLInputElement>(null)

	const [status, setStatus] = React.useState<HomeStatus>({
		submitLabel:'',
		loading:false,
		query: '',
	})
	const [isPending, setPending] = React.useState(false)
	
	const updateStatus = (json) => setStatus({...status, ...json})

	

	React.useEffect(()=>{
		try {
			if (!G.inited && !G.loading) {
				G.update({loading:true})
				request('/get-all-tokens').then(response=>{
					if (response && response.result) {
						const res = response.result
						console.log(res)
						const coins = {} as CoinTypes
						for(let chain in res) {
							for(let i in res[chain]) {
								const v = res[chain][i]
								if (coins[v.symbol]===undefined) coins[v.symbol] = {}
								coins[v.symbol][chain.toUpperCase()] = { address:v.address, decimals:v.decimals }
							}
						}
						checkPending()
						G.update({coins, ...G.getPending(), inited:true, loading:false})
					} else {
						G.update({loading:false})
					}
				})
			}
		} catch (error) {
			console.log(error)
		}
	}, [])

	React.useEffect(()=>{
		if (isPending) return;
		let timer;
		try {
			timer = setTimeout(checkPending, 5000)
		} catch (error) {
			console.log(error)
		}
		return ()=>timer && clearTimeout(timer)
	}, [isPending])

	const onChangeNetwork = (chain:string)=>{
		const net = networks[chain];
		const chainId = net.chainId;
		const rpc = net.rpc;
		const _chain = G.targetChain==='ICICB' ? 'chain' : 'targetChain'
		G.update({[_chain]:chain, chainId, rpc})
		
		if (refMenu && refMenu.current) {
			refMenu.current.style.display = 'none'
			setTimeout(()=>(refMenu && refMenu.current && (refMenu.current.style.display = '')), 100)
		}
	}
	const addNetwork = () => {
		G.addNetwork()
	}
	const swapChains = () => {
		const net = networks[G.targetChain]
		const chainId = net.chainId
		const rpc = net.rpc
		G.update({chain:G.targetChain, targetChain:G.chain, /* token, */ chainId, rpc})
	}

	const checkPending = async () => {
		try {
			if (!isPending) {
				setPending(true)
				const params1:{[chainId:string]:Array<string>} = {};
				const params2:Array<string> = [];
				for(let k in G.pending) {
					const v = G.pending[k]
					const confirmations = G.txs[k]?.confirmations || 0
					if (networks[v.chain].confirmations > confirmations) {
						if (params1[v.chain]===undefined) params1[v.chain] = []
						params1[v.chain].push(k)
					} else {
						if (G.txs[k] && !G.txs[k].err && !G.txs[k].tx) params2.push(k)
					}
				}
				if (Object.keys(params1).length) {
					const res = await Promise.all(Object.keys(params1).map(k=>G.check(k, params1[k])))
					const txs:TxTypes = {...G.txs}
					const now = Math.round(new Date().getTime() / 1000)
					for(let v of res) {
						if (v) {
							for(let k in v) {
								if (v[k]===-1) {
									if (now - G.pending[k].created > 600) txs[k] = {...txs[k], err:true}
								} else {
									txs[k] = {...txs[k], confirmations:v[k]}
								}
							}
						}
					}
					G.setTxs(txs)
				}
				if (params2.length) {
					const rows = await request('get-txs', params2)
					/* const rows = await data.json() */
					if (rows && Array.isArray(rows)) {
						const now = Math.round(new Date().getTime() / 1000)
						const txs:TxTypes = {...G.txs}
						for(let v of rows) {
							if (v.tx || (v.err && now - G.pending[v.key].created > 600)) {
								txs[v.key] = {...txs[v.key], tx:v.tx, err:v.err, fee:v.fee}
							}
						}
						G.setTxs(txs)
					}
				}
				setPending(false)
			}
		} catch (err) {
			console.log(err)
		}
	}

	const onChangeQuery = (query:string)=>{
		updateStatus({query})
	}

	const onChangeToken = (token:string)=>{
		G.update({token})
		if (refList && refList.current) {
			refList.current.checked = false
		}
	}

	const onChangeValue = (value:string)=>{
		G.update({value})
	}
	
	const submit = async ()=>{
		try {
			if (G.status===CONNECTED) {
				const token = G.coins[G.token][G.chain]
				const targetToken = G.coins[G.token][G.targetChain]
				const amount = Number(G.value)
				const value = fromEther(amount, token.decimals)
				if (token && amount>0) {
					G.update({err:''})
					updateStatus({loading:true, submitLabel:'checking balance...'})
					const rbalance = await G.balance(token.address)
					const rbalance1 = G.targetChain==='ICICB' ? value : await G.bridgebalance(G.targetChain, targetToken.address)
					if (rbalance!==undefined && rbalance1!==undefined) {
						const balance = toEther(rbalance, token.decimals)
						const balance1 =  toEther(rbalance1, targetToken.decimals)
						if (balance>=amount) {
							if (balance1>=amount) {
								let success = true
								if (token.address!=='-') {
									updateStatus({loading:true, submitLabel:'checking allowance...'})
									const rApproval = await G.approval(token.address)
									if (rApproval!==undefined) {
										const approval = toEther(rApproval, token.decimals)
										console.log('approval', approval, 'decimals', token.decimals)
										if (approval<amount) {
											updateStatus({loading:true, submitLabel:'allow brige contract ...'})
											let tx = await G.approve(token.address, value)
											if (tx!==undefined) {
												success = await G.waitTransaction(tx)
											} else {
												success = false
											}
										}
									} else {
										success = false
									}
								}
								if (success) {
									updateStatus({loading:true, submitLabel:'exchanging...'})
									const tx = await G.deposit(token.address==='-' ? ZERO : token.address, value, networks[G.targetChain].chainId)
									if (tx!==undefined) {
										updateStatus({loading:true, submitLabel:'confirming...'})
										G.setPending(tx, {chain:G.chain, targetChain:G.targetChain, address:G.address, token:G.token, value:amount, created:Math.round(new Date().getTime()/1000)})
										await G.waitTransaction(tx)
										G.update({value:''})	
									}
								} else {
									G.update({err:'the transaction failed'})	
								}
							} else {
								G.update({err:"Sorry, there is not enough balance in the bridge store for swap."})	
							}
						} else {
							G.update({err:"You haven't enough balance for swap"})
						}
						
					}
				} else if (refAmount?.current) {
					refAmount.current.focus()
				}
				updateStatus({loading:false})
			} else {
				updateStatus({submitLabel:'Connecting...'})
				G.connect()
			}
		} catch (err:any) {
			G.update({err:err.message})
			updateStatus({loading:false})
		}
	}
	const ViewNetwork = (chain) => {
		return (chain==='ICICB') ? (
			<div className="chain flex">
				<img className="icon" src="/logo.svg" alt="icicb"  />
				<div style={{marginTop:10}}>{L['chain.icicb']}</div>
			</div>
		) : (
			<div className="chain">
				<img className="icon" src={`/networks/${chain}.svg`}  alt={chain}/>
				<div className="flex" style={{marginTop:10}}>
					<div className="fill">{L['chain.' + chain.toLowerCase()]}</div>
					<div>
						<div className="menu">
							<i><span className="ic-down"></span></i>
							<ul ref={refMenu} className={G.chain==='ICICB' ? 'right' : ''} style={{width:150}}>
								{Object.keys(networks).map(k=>
									k==='ICICB' ? null : (<li className={!!networks[k].disabled ? 'disabled' : ''} key={k}  onClick={()=>!!networks[k].disabled ? null : onChangeNetwork(k)}>
										<img className="icon" src={`/networks/${k}.svg`} alt="eth"/>
										<span>{L['chain.' + k.toLowerCase()]}</span>
									</li>)
								)}
							</ul>
						</div>
					</div>
				</div>
			</div>
		)
	}

	const pendingTxs:Array<any> = []; 
	const targetToken = G.coins[G.token] && G.coins[G.token][G.targetChain]
	const supported = targetToken!==undefined;
		
	const erc20 = networks[G.chain].erc20;
	const query = status.query.toLowerCase();
	
	
	for(let k in G.pending) {
		pendingTxs.push({key:k, ...G.pending[k]})
	}
	pendingTxs.sort((a,b)=>b.created - a.created)

	const nativeCoin = networks[G.chain].coin
	const tokenArray:Array<string> = nativeCoin==='ICICB' ? [] : [nativeCoin];
	for(let k in G.coins) {
		if (k===nativeCoin) continue
		const v = G.coins[k]
		if (v[G.chain]!==undefined && v[G.targetChain]!==undefined) {
			if (query!=='' && k.toLowerCase().indexOf(query)===-1) continue
			tokenArray.push(k)
		}
	}
	let loading = G.status===CONNECTING || status.loading;
	
	return <Layout className="home">
		<section>
			<div className="c4 o1-md">
				<div className="panel">
					<h1 className="gray">{L['bridge']}</h1>
					<p className="gray">{L['description']}</p>
					<div className="mt4 mb-3"><a href="/" className="button">Introduction video</a></div>
					<p><a className="cmd" href="/">View Proof of Assets</a></p>
					<p><a className="cmd" href="/">User Guide</a></p>
					<div className="hide-md" style={{marginTop:20}}>
						<img src="/logo.svg" alt="logo" style={{width:'100%', opacity:0.3}} />
					</div>
				</div>
			</div>
			<div className="c ml3-md">
				<div className="panel swap">
				<p className="gray">If you have not add ICICB Chain network in your MetaMask yet, please click <span className="cmd" onClick={addNetwork}>Add network</span> and continue</p>
					<div className="flex">
						<div className="c">
							{ViewNetwork(G.chain)}
						</div>
						<div className="flex middle center" style={{paddingLeft:20, paddingRight:20}}>
							<button className="button switch" onClick={()=>swapChains()}>
								<svg fill="white" width="18" viewBox="0 0 18 18"><path d="M10.47 1L9.06 2.41l5.1 5.1H0V9.5h14.15l-5.09 5.09L10.47 16l7.5-7.5-7.5-7.5z"></path></svg>
							</button>
						</div>
						<div className="c">
							{ViewNetwork(G.targetChain)}
						</div>
					</div>
					<div className="label" style={{paddingTop:30}}>Asset</div>
					<div className="asset">
						<input ref={refList} id="asset" type="checkbox" style={{display:'none'}} />
						<label className="asset" htmlFor="asset">
							<div className="flex">
								<img src={G.token===nativeCoin ? `/networks/${G.chain}.svg` : `/coins/${G.token}.svg`} style={{width:20, height:20, marginRight:10}} alt={G.token} />
								<span>{G.token} <small>({G.token===nativeCoin ? L['token.native'] : erc20})</small></span>
							</div>
							<div>
								<svg width="11" fill="#888" viewBox="0 0 11 11"><path d="M6.431 5.25L2.166 9.581l.918.919 5.25-5.25L3.084 0l-.918.919L6.43 5.25z"></path></svg>
							</div>
						</label>
						
						<div className="list">
							<div className="search">
								<svg width="24" height="24" fill="#5e6673" viewBox="0 0 24 24"><path d="M3 10.982c0 3.845 3.137 6.982 6.982 6.982 1.518 0 3.036-.506 4.149-1.416L18.583 21 20 19.583l-4.452-4.452c.81-1.113 1.416-2.631 1.416-4.149 0-1.922-.81-3.643-2.023-4.958C13.726 4.81 11.905 4 9.982 4 6.137 4 3 7.137 3 10.982zM13.423 7.44a4.819 4.819 0 011.416 3.441c0 1.315-.506 2.53-1.416 3.44a4.819 4.819 0 01-3.44 1.417 4.819 4.819 0 01-3.441-1.417c-1.012-.81-1.518-2.023-1.518-3.339 0-1.315.506-2.53 1.416-3.44.911-1.012 2.227-1.518 3.542-1.518 1.316 0 2.53.506 3.44 1.416z"></path></svg>
								<input type="text" value={status.query} maxLength={6} onChange={(e)=>onChangeQuery(e.target.value.trim())} />
							</div>
							<div style={{overflowY: 'auto', maxHeight: 200, boxShadow: '0 3px 5px #000'}}>
								<ul>
									{tokenArray.map(k=>
										<li key={k} onClick={()=>onChangeToken(k)}>
											<img src={k===nativeCoin ? `/networks/${G.chain}.svg` : `/coins/${k}.svg`} loading='lazy' style={{width:20, height:20, marginRight:10}} alt={k} />
											<span>{k}</span>
											<small>{k===nativeCoin ? L['token.native'] : erc20}</small>
										</li>
									)}
								</ul>
							</div>
						</div>
						<label className="overlay" htmlFor="asset"></label>
					</div>
					{G.inited ? (
						!supported ? (
							<p style={{color:'red', backgroundColor: '#2b2f36', padding: 10}}>{`We do not support ${L['chain.' + G.targetChain.toLowerCase()]}'s ${G.token} swap now.`}</p>
						) : null
					) : null}
					<div className="label" style={{paddingTop:20}}>Amount</div>
					<div>
						<input disabled={!supported} ref={refAmount} className="amount" type="number" value={G.value} onChange={(e)=>onChangeValue(e.target.value)} />
					</div>

					{G.value!=='' && targetToken ? (
						<p className="gray">You will receive ≈ {G.value} {G.token==='-' ? networks[G.chain].coin : G.token} <small>({targetToken.address==='-' ? 'native token' : networks[G.targetChain].erc20})</small></p>
					) : null}
					<div style={{paddingTop:20}}>
						<button disabled={loading || !supported} className="primary full" onClick={submit}>
							{loading ? (
								<div className="flex middle">
									<div style={{width:'1.5em'}}>
										<div className="loader">Loading...</div>
									</div>
									<div>{status.submitLabel}</div>
								</div>) : (G.status===CONNECTED ? 'SUBMIT' : 'Connect wallet')
							}
						</button>
						
						{G.err ? (
							<p style={{color:'red', backgroundColor: '#2b2f36', padding: 10}}>{G.err}</p>
						) : (
							<p style={{color:'#35ff35'}}>{G.address ? 'Your wallet: ' + G.address.slice(0,10) + '...' + G.address.slice(-4) : ''}</p>
						)}
					</div>
					{pendingTxs.length ? (
						<div style={{paddingTop:20}}>
							<p><b className="label">Your transactions:</b></p>
							<div style={{maxHeight:300, overflowY:'auto'}}>
							{pendingTxs.map((v,k)=>(
								<div className={"tx flex" + (G.txs[v.key]?.tx ? '' : ' pending') } key={k}>
									<div className="c1">
										<img src={`/networks/${v.chain}.svg`} style={{width:16, height:16, marginRight:5}} alt={v.chain} />
										<span>To</span>
										<img src={`/networks/${v.targetChain}.svg`} style={{width:16, height:16, marginLeft:5}} alt={v.targetChain} />
									</div>
									<code className="c2"><a className="cmd" href={networks[v.chain].explorer + '/tx/' + v.key} target="_blank" rel="noreferrer" >{v.key.slice(0,10) + '...' + v.key.slice(-4)}</a></code>
									<code className="c3">
										<img src={`/coins/${v.token}.svg`} loading='lazy' style={{width:20, height:20, marginRight:5}} alt={v.token} />
										<span title={G.txs[v.key]?.fee || ''}>{v.value}</span>
									</code>
									<div className="c4" style={{textAlign:"right"}}>
										{G.txs[v.key] ? (
											G.txs[v.key].tx ? (
												<a className="cmd" href={networks[v.targetChain].explorer + '/tx/' + G.txs[v.key].tx} target="_blank" rel="noreferrer">view result</a>
											) : (
													G.txs[v.key].err ? (<code style={{color:'red'}}>error</code>) : (<code style={{color:'#76808f'}}>{G.txs[v.key].confirmations >= networks[v.chain].confirmations ? 'processing…' : G.txs[v.key].confirmations + ' / ' + networks[v.chain].confirmations}</code>
											))
										) : <code style={{color:'#76808f'}}>confirming...</code>
										}
									</div>
								</div>
							))}
							</div>
						</div>
					) : null}
				</div>
			</div>
		</section>
	</Layout>;
};

export default Home;