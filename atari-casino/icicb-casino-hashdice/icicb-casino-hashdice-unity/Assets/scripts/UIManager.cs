using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using UnitySocketIO;
using UnitySocketIO.Events;
using System.Runtime.InteropServices;
using SimpleJSON;

public class UIManager : MonoBehaviour
{
    public TMP_Text info_Text;
    public TMP_Text walletAmount_Text;

    public TMP_InputField AmountField;
    public TMP_InputField ProfitField;
    public TMP_InputField OddField;
    public TMP_InputField ChanceField;

    public TMP_Text highNum;
    public TMP_Text lowNum;
    public TMP_InputField highNumField;
    public TMP_InputField lowNumField;

    private int stateFlag = 0;
    private float betNumber;
    public SocketIOController io;

    public Button BetBtn;

    private bool connectedToServer = false;

    public TMP_Text reelText1;
    public TMP_Text reelText2;
    public TMP_Text reelText3;
    public TMP_Text reelText4;
    private bool isbetting = false;
    private float betTime = 0;

    BetPlayer _player;

    // GameReadyStatus Send
    [DllImport("__Internal")]
    private static extern void GameReady(string msg);
    // Start is called before the first frame update
    void Start()
    {
        ChanceField.text = "50.0";
        AmountField.text = "10.0";

        _player = new BetPlayer();

        OddField.text = (95.0f / float.Parse(ChanceField.text)).ToString("F2");
        ProfitField.text = ((float.Parse(AmountField.text)) * (float.Parse(OddField.text) - 1.0f)).ToString("F2");

        betNumber = 9999f - float.Parse(ChanceField.text) * 100;
        highNumField.text = ((int)betNumber).ToString();

        io.Connect();

        io.On("connect", (e) =>
        {
            connectedToServer = true;
            Debug.Log("Game started");
            io.On("bet result", (res) =>
            {
                StartCoroutine(BetResult(res));
            });

            io.On("error message", (res) =>
            {
                ShowError(res);
            });
        });
        

        #if UNITY_WEBGL == true && UNITY_EDITOR == false
            GameReady("Ready");
        #endif
    }

    // Update is called once per frame
    void Update()
    {
       if(isbetting)
        {
            SetReelRandomNumber();
        }
    }

    void ShowError(SocketIOEvent socketIOEvent)
    {
        isbetting = false;
        BetBtn.interactable = true;
        var res = ReceiveJsonObject.CreateFromJSON(socketIOEvent.data);
        info_Text.text = res.errMessage.ToString();
    }


    IEnumerator BetResult(SocketIOEvent socketIOEvent)
    {
        isbetting = true;
        BetBtn.interactable = true;
        var res = ReceiveJsonObject.CreateFromJSON(socketIOEvent.data);
        yield return new WaitForSeconds(1.5f);
        isbetting = false;
        walletAmount_Text.text = res.amount.ToString("F2");
        if (res.gameResult)
            info_Text.text = "You Win!  You earned " + float.Parse(AmountField.text).ToString("F2")+ " + " +  (res.earnAmount - float.Parse(AmountField.text)).ToString("F2") +"!";
        else
            info_Text.text = "You Lose!";
        SetReelText(res.randomNumber);
        Debug.Log(res.amount + "   " + res.earnAmount + "   " + res.gameResult + "  " + res.randomNumber);
    }

    public void RequestToken(string data)
    {
        JSONNode usersInfo = JSON.Parse(data);
        Debug.Log("token=--------"+usersInfo["token"]);
        Debug.Log("amount=------------"+usersInfo["amount"]);
        Debug.Log("userName=------------" + usersInfo["userName"]);
        _player.token = usersInfo["token"];
        _player.username = usersInfo["userName"];

        float i_balance = float.Parse(usersInfo["amount"]);
        walletAmount_Text.text = i_balance.ToString("F2");
    }

    public void HighBtn_Clicked()
    {
        stateFlag = 0;
        betNumber = 9999f - float.Parse(ChanceField.text) * 100;
        highNumField.text = ((int)betNumber).ToString();
    }

    public void LowBtn_Clicked()
    {
        stateFlag = 1;
        betNumber = float.Parse(ChanceField.text) * 100;
        lowNumField.text = ((int)betNumber).ToString();
    }

    public void MinBtn_Clicked()
    {
        AmountField.text = "10.0";
    }

    public void CrossBtn_Clicked()
    {
        float amount = float.Parse(AmountField.text);
        if (amount >= 100000f)
            AmountField.text = "100000.0";
        else
            AmountField.text = (amount * 2.0f).ToString("F2");
    }

    public void HalfBtn_Clicked()
    {
        float amount = float.Parse(AmountField.text);
        if (amount <= 10f)
            AmountField.text = "10.0";
        else
            AmountField.text = (amount / 2.0f).ToString("F2");
    }

    public void MaxBtn_Clicked()
    {
        float myTotalAmount = float.Parse(string.IsNullOrEmpty(walletAmount_Text.text) ? "0" : walletAmount_Text.text);
        if (myTotalAmount >= 100000f)
            AmountField.text = "100000.0";
        else if (myTotalAmount >= 10f && myTotalAmount < 100000f)
            AmountField.text = myTotalAmount.ToString("F2");
    }

    public void AmountField_Changed()
    {
        if (float.Parse(AmountField.text) <= 10f)
            AmountField.text = "10.0";
        else if (float.Parse(AmountField.text) >= 100000f)
        {
            AmountField.text = "100000.0";
        }
        ProfitField.text = ((float.Parse(string.IsNullOrEmpty(AmountField.text) ? "0" : AmountField.text)) * ( float.Parse(string.IsNullOrEmpty(OddField.text) ? "0" : OddField.text) - 1.0f)).ToString("F2");
    }

    public void NumberField_EditEnd()
    {
        if (stateFlag == 0)
        {
            betNumber = int.Parse(highNumField.text);
            ChanceField.text = ((9999 - betNumber) / 100f).ToString("F2");
            OddField.text = (95.0f / float.Parse(ChanceField.text)).ToString("F2");
        }
        else if (stateFlag == 1)
        {
            betNumber = int.Parse(lowNumField.text);
            ChanceField.text = (betNumber/ 100f).ToString("F2");
            OddField.text = (95.0f / float.Parse(ChanceField.text)).ToString("F2");
        }
    }

    public void ChanceField_EditEnd()
    {
        if (float.Parse(ChanceField.text) <= 0.01f)
            ChanceField.text = "0.01";
        else if (float.Parse(ChanceField.text) >= 94.99f)
        {
            ChanceField.text = "94.99";
        }
        OddField.text = (95.0f / float.Parse(ChanceField.text)).ToString("F2");
        ProfitField.text = ((float.Parse(AmountField.text)) * (float.Parse(OddField.text) - 1.0f)).ToString("F2");

        if (stateFlag == 0)
        {
            betNumber = 9999f - float.Parse(ChanceField.text) * 100;
            highNumField.text = ((int)betNumber).ToString();
        }
        else if (stateFlag == 1)
        {
            betNumber = float.Parse(ChanceField.text) * 100;
            lowNumField.text = ((int)betNumber).ToString();
        }
    }

    public void Odd_EditEnd()
    {
        if (float.Parse(OddField.text) <= 1.0001f)
            OddField.text = "1.0001";
        else if (float.Parse(OddField.text) >= 9500f)
        {
            OddField.text = "9500";
        }
        ChanceField.text = (95.0f / float.Parse(OddField.text)).ToString("F2");
        ProfitField.text = ((float.Parse(AmountField.text)) * (float.Parse(OddField.text) - 1.0f)).ToString("F2");

        if (stateFlag == 0)
        {
            betNumber = 9999f - float.Parse(ChanceField.text) * 100;
            highNum.text = ((int)betNumber).ToString() + "<";
        }
        else if (stateFlag == 1)
        {
            betNumber = float.Parse(ChanceField.text) * 100;
            lowNum.text = "<"+((int)betNumber).ToString();
        }
    }


    public void BetBtn_Clicked()
    {   
        if(connectedToServer)
        {
            info_Text.text = "";
            JsonType JObject = new JsonType();
            float myTotalAmount = float.Parse(string.IsNullOrEmpty(walletAmount_Text.text) ? "0" : walletAmount_Text.text);
            float betamount = float.Parse(string.IsNullOrEmpty(AmountField.text) ? "0" : AmountField.text);
            float amount = float.Parse(string.IsNullOrEmpty(walletAmount_Text.text) ? "0" : walletAmount_Text.text);
            if (betamount <= myTotalAmount)
            {
                BetBtn.interactable = false;
                JObject.userName = _player.username;
                JObject.token = _player.token;
                JObject.chance = float.Parse(string.IsNullOrEmpty(ChanceField.text) ? "0" : ChanceField.text);
                JObject.betAmount = betamount;
                JObject.stateFlag = stateFlag;
                JObject.amount = amount;
                if (stateFlag == 0)
                    JObject.compareNum = (int)betNumber;
                else if (stateFlag == 1)
                    JObject.compareNum = (int)betNumber;
                io.Emit("bet info", JsonUtility.ToJson(JObject));
            }
            else
                info_Text.text = "Not enough Funds";
        }
        else
        {
            info_Text.text = "Can't connect to Game Server!";
        }
        
    }

    private void SetReelText(int resultNum)
    {
        reelText1.text = (resultNum / 1000).ToString();
        reelText2.text = ((resultNum / 100) % 10).ToString();
        reelText3.text = ((resultNum / 10) % 10).ToString();
        reelText4.text = (resultNum % 10).ToString();
    }

    private void SetReelRandomNumber()
    {
        reelText1.text = Random.Range(0,9).ToString();
        reelText2.text = Random.Range(0, 9).ToString();
        reelText3.text = Random.Range(0, 9).ToString();
        reelText4.text = Random.Range(0, 9).ToString();        
    }    
}

public class BetPlayer
{
    public string username;
    public string token;
}
