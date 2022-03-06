import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import Hidescrollbutton from "./components/Hidescrollbutton";
import Home from "./components/home/Home";
import Explore from "./components/explore/Explore";
import Collection from "./components/collection/Collection";
import LiveAuction from "./components/liveauction/LiveAuction";
import ItemDetail from "./components/itemdetail/ItemDetail";
import Wallet from "./components/wallet/Wallet";
import CreateCollection from "./components/createcollection/CreateCollection";
import CreateSingleCollection from "./components/createcollection/CreateSingleCollection";
import CreateMultiCollection from "./components/createcollection/CreateMultiCollection";
import Login from "./components/signpage/Login";
import Register from "./components/signpage/Register";
import Activity from "./components/activity/Activity";
import Ranking from "./components/ranking/Ranking";
import Author from "./components/author/Author";
import Modal from "./components/Modal";
import ConnectWallet from "./components/ConnectWallet";
import "./App.css";
import ScrollToTop from "./components/ScrollToTop"

function App(props) {
  return (
    <Router>
      <ScrollToTop>
        <Header />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route exact path="/marketplace" exact component={Explore} />
          <Route path="/collections" exact component={Collection} />
          <Route exact path="/:id" exact component={ItemDetail} />
          {/* <Route path="/live-auction" exact component={LiveAuction} />
        <Route path="/author" exact component={Author} />
        <Route path="/wallet" exact component={Wallet} />
        <Route path="/create-collection" exact component={CreateCollection} />
        <Route
          path="/create-single-collection"
          exact
          component={CreateSingleCollection}
        />
        <Route
          path="/create-multi-collection"
          exact
          component={CreateMultiCollection}
        />
        <Route path="/login" exact component={Login} />
        <Route path="/reg" exact component={Register} />
        <Route path="/activity" exact component={Activity} />
        <Route path="/ranking" exact component={Ranking} />
        <Route path="/modal" exact component={Modal} />
        <Route path="/connect" exact component={ConnectWallet} /> */}
        </Switch>
        <Hidescrollbutton />
        <Footer />
      </ScrollToTop>
    </Router>
  );
}
export default App;
