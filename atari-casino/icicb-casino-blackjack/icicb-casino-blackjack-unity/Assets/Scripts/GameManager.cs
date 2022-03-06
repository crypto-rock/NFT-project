using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System;
using System.Timers;
using Random = UnityEngine.Random;
using TMPro;
using UnityEngine.Networking;
using System.Runtime.InteropServices;
using Newtonsoft.Json.Linq;
using System.Linq;
using UnityEngine.SceneManagement;
using SimpleJSON;

public class GameManager : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void GameController(string msg);

    public Transform[] myprefab = new Transform[52];
    public InputField bet;
    public Text balance;
    public Text p_State;
    public Text S_State;
    public Text D_State;
    public static APIForm apiform;
    public static Globalinitial _global;
    public GameObject DealButton;
    public GameObject HitButton;
    public GameObject StandButton;
    public GameObject SplitButton;
    public GameObject InsuranceButton;
    public GameObject DoubleButton;
    public GameObject ForfeitButton;
    public GameObject one;
    public GameObject two;

    public Sprite a_response;
    public Sprite a_server;
    public Sprite a_bet;
    public GameObject Error;

    private Transform Card;
    private Vector3 f_vector = new Vector3(0.523f, 1.057f, 0.2007f);
    private Vector3 e_vector;
    private Vector3 f_rotation = new Vector3(0,-43,-126);
    private Vector3 e_rotation = new Vector3(0,0,0);

    private bool insuranceBool = false;
    private bool p_moneyCheck;
    private bool splitBool = false;
    private string Token = "";
    private int dealerCount =0;
    private int playerCount =0;
    private int splitCount =0;
    private float myBet =100;
    private float myBal;
    private float time = 0;
    private float endTime = 0.3f;

    void Start()
    {
#if UNITY_WEBGL == true && UNITY_EDITOR == false
        GameController("Ready");
#endif
    defaltButton();
    }

    void Update()
    {

    }

    public void plusButton()
    {
        if (myBet + 100 > myBal)
        {
            myBet = myBal;
        }
        else
        {
            myBet +=100;
        }
        bet.text = myBet.ToString();
    }
    public void minuseButton()
    {
        if (myBet < 110)
        {
            myBet = 10;
        }
        else
        {
            myBet -= 100;
        }
        bet.text = myBet.ToString();
    }

    public void inputChange()
    {
        myBet = Single.Parse(bet.text);
        if (myBet > myBal)
        {
            myBet = myBal;
        }else if (myBet < 10)
        {
            myBet = 10;
        }
        bet.text = myBet.ToString();
    }


    public void GameStart(){
        if (myBal >= myBet && myBal>=10)
        {
            insuranceBool = false;
            S_State.text = "";
            p_State.text = "";
            D_State.text = "";  
            cardDestroy();
            dealerCount = 0;
            playerCount = 0;
            splitCount = 0;
            p_moneyCheck = true;
            splitBool = false;
            StartCoroutine(Deal());
        }
    }

    public void Hit()
    {
        StartCoroutine(connectServer("Hit"));
    }

    public void Stand()
    {
        ForfeitButton.SetActive(false);
        StartCoroutine(connectServer("Stand"));

    }

    public void Split()
    {
        splitBool = true;
        myBet = myBet / 2;
        StartCoroutine(c_Split());
    }

    public void Double()
    {
        if (insuranceBool)
        {
            myBet = myBet * 2;
        }
        if (myBal >= myBet)
        {
        ForfeitButton.SetActive(false);
            StartCoroutine(myBalance());
            StartCoroutine(connectServer("Double"));
        }
    }

    public void Insurance()
    {
        insuranceBool = true;
        myBet = myBet / 2;
        StartCoroutine(myBalance());
        StartCoroutine(InsuranceServer());
    }
    public void Forfiet(){
        ForfeitButton.SetActive(false);
        StartCoroutine(c_Forfiet());
    }

    private IEnumerator Deal()
    {
        myBet = Single.Parse(bet.text);
        DealButton.SetActive(false);
        WWWForm form = new WWWForm();
        form.AddField("token", Token);
        form.AddField("betValue", myBet.ToString());
        _global = new Globalinitial();
        UnityWebRequest www = UnityWebRequest.Post(_global.BaseUrl + "api/start-Blackjack", form);
        yield return www.SendWebRequest();
        if(www.result != UnityWebRequest.Result.Success)
        {
            Error.GetComponent<Image>().sprite = a_response;
            Error.SetActive(true);
            yield return new WaitForSeconds(2.49f);
            Error.SetActive(false);
            DealButton.SetActive(true);
        }
        else
        {
            string strData = System.Text.Encoding.UTF8.GetString(www.downloadHandler.data);
            apiform = JsonUtility.FromJson<APIForm>(strData);
            StartCoroutine(myBalance());
            StartCoroutine(MessageCheck());
        }
    }

    private IEnumerator c_Forfiet(){
        WWWForm form = new WWWForm();
        form.AddField("token",Token);
         _global = new Globalinitial();
        UnityWebRequest www = UnityWebRequest.Post(_global.BaseUrl + "api/Forfiet", form);
        yield return www.SendWebRequest();
        if(www.result != UnityWebRequest.Result.Success)
        {
            Error.GetComponent<Image>().sprite = a_response;
            Error.SetActive(true);
            yield return new WaitForSeconds(2.49f);
            Error.SetActive(false);
            defaltButton();
            DealButton.SetActive(true);
        }
        else
        {
            if(splitBool){
                string strData = System.Text.Encoding.UTF8.GetString(www.downloadHandler.data);
                apiform = JsonUtility.FromJson<APIForm>(strData);
                if(apiform.playerForfeit){
                    playerCard();
                    p_State.text = "";
                }else if(apiform.splitForfeit){
                    splitCard();
                    S_State.text = "";
                }
                if(apiform.playerForfeit && apiform.splitForfeit){
                    dealerCard();
                    D_State.text = "";
                }
            }else{
                cardDestroy();
                p_State.text = "";
                D_State.text = "";
                if(!insuranceBool){
                    myBet = myBet/2;
                }
                StartCoroutine(winMoney(myBet));
                defaltButton();
            }
        }
    }

    private IEnumerator InsuranceServer()
    {
        WWWForm form = new WWWForm();
        form.AddField("token", Token);
        _global = new Globalinitial();
        UnityWebRequest www = UnityWebRequest.Post(_global.BaseUrl + "api/Insurance", form);
        yield return www.SendWebRequest();
        if (www.result != UnityWebRequest.Result.Success)
        {
            Error.GetComponent<Image>().sprite = a_response;
            Error.SetActive(true);
            yield return new WaitForSeconds(2.49f);
            Error.SetActive(false);
            defaltButton();
        }
        else
        {
            string strData = System.Text.Encoding.UTF8.GetString(www.downloadHandler.data);
            apiform = JsonUtility.FromJson<APIForm>(strData);
            buttonState();
        }
    }
    private void buttons(){
        DealButton.SetActive(false);
        HitButton.SetActive(false);
        StandButton.SetActive(false);
        SplitButton.SetActive(false);
        DoubleButton.SetActive(false);
        InsuranceButton.SetActive(false);
    }

    private IEnumerator connectServer(string pass)
    {
        buttons();
        WWWForm form = new WWWForm();
        form.AddField("token", Token);
        _global = new Globalinitial();
        UnityWebRequest www = UnityWebRequest.Post(_global.BaseUrl + "api/" + pass,form);
        yield return www.SendWebRequest();
        if(www.result != UnityWebRequest.Result.Success)
        {
            Error.GetComponent<Image>().sprite = a_response;
            Error.SetActive(true);
            yield return new WaitForSeconds(2.49f);
            Error.SetActive(false);
            defaltButton();
        }
        else
        {

            string strData = System.Text.Encoding.UTF8.GetString(www.downloadHandler.data);
            apiform = JsonUtility.FromJson<APIForm>(strData);
            if (apiform.insuranceMoney > 0)
            {
                StartCoroutine(winMoney(apiform.insuranceMoney));
            }
            StartCoroutine(gameCards());
        }
    }

    private IEnumerator c_Split()
    {
        buttons();
        WWWForm form = new WWWForm();
        form.AddField("token", Token);
        _global = new Globalinitial();
        UnityWebRequest www = UnityWebRequest.Post(_global.BaseUrl + "api/Split", form);
        yield return www.SendWebRequest();
        if (www.result != UnityWebRequest.Result.Success)
        {
            Error.GetComponent<Image>().sprite = a_response;
            Error.SetActive(true);
            yield return new WaitForSeconds(2.49f);
            Error.SetActive(false);
            defaltButton();
        }
        else
        {
            string strData = System.Text.Encoding.UTF8.GetString(www.downloadHandler.data);
            apiform = JsonUtility.FromJson<APIForm>(strData);
            time = 0;
            Transform splitTransform = GameObject.FindGameObjectsWithTag("Card")[1].transform;
            playerCount = 1;
            splitCount = 1;
            e_vector = new Vector3(0.342f, 1.02f, -0.189f);
            Vector3 s_rotation = new Vector3(0, -19, 0);
            while (time < endTime)
            {
                GameObject.FindGameObjectsWithTag("Card")[1].transform.position = Vector3.Lerp(splitTransform.position, e_vector, time / endTime);
                GameObject.FindGameObjectsWithTag("Card")[1].transform.rotation = Quaternion.Lerp(Quaternion.Euler(new Vector3(0,0,0)), Quaternion.Euler(s_rotation), time / endTime);
                time += Time.deltaTime;
                yield return null;
            }
            GameObject.FindGameObjectsWithTag("Card")[1].transform.position = e_vector;
            buttonState();
            p_State.text = apiform.playertotalWeight.ToString();
            S_State.text = apiform.splittotalWeight.ToString();
        }
    }

    private IEnumerator MessageCheck()
    {
        if(apiform.myMessage == 0)
        {
            StartCoroutine(gameCards());
        }else if(apiform.myMessage == 1)
        {
            Error.GetComponent<Image>().sprite = a_server;
            Error.SetActive(true);
            yield return new WaitForSeconds(2.49f);
            Error.SetActive(false);
            defaltButton();
        }
        else
        {
            Error.GetComponent<Image>().sprite = a_bet;
            Error.SetActive(true);
            yield return new WaitForSeconds(2.49f);
            Error.SetActive(false);
            defaltButton();
        }
    }
    private void defaltButton()
    {
        DealButton.SetActive(true);
        HitButton.SetActive(false);
        StandButton.SetActive(false);
        SplitButton.SetActive(false);
        DoubleButton.SetActive(false);
        InsuranceButton.SetActive(false);
        ForfeitButton.SetActive(false);
    }

    private IEnumerator gameCards()
    {
        for(int i = playerCount; i < apiform.playerCount; i++)
        {
            Transform prefap = myprefab[apiform.playerCards[i]];
            e_vector = new Vector3(i * 0.02f, 1.02f + i * 0.01f, -0.23f);
            string cardName = "Cards_H";
            yield return Cardposition(i,e_vector,prefap,cardName);
            
        }
        if(p_State.text!="Win"&& p_State.text != "Lose" && p_State.text != "Tie")
            p_State.text = apiform.playertotalWeight.ToString();
        for (int i = splitCount; i < apiform.splitCount; i++)
        {
            Transform prefap = myprefab[apiform.splitCards[i]];
            e_vector = new Vector3(0.342f+i * 0.02f, 1.02f + i * 0.01f, -0.189f+0.011f);
            string cardName = "Cards_S";
            yield return splitCard(i, e_vector, prefap, cardName);
        }
        if(apiform.splittotalWeight != 0)
        {
            if (S_State.text != "Win" && S_State.text != "Lose" && S_State.text != "Tie")
                S_State.text = apiform.splittotalWeight.ToString();
        }
        for (int i = dealerCount; i < apiform.dealerCount; i++)
        {
            Transform prefap = myprefab[apiform.dealerCards[i]];
            e_vector = new Vector3(i * 0.02f, 1.02f + i * 0.01f, 0.15f);
            string cardName = "Cards_D";
            yield return Cardposition(i, e_vector, prefap, cardName);
        }
        D_State.text = apiform.dealertotalWeight.ToString();

        playerCount = apiform.playerCount;
        splitCount = apiform.splitCount;
        dealerCount = apiform.dealerCount;
        buttonState();
        gameState();
    }

    private IEnumerator splitCard(int num,Vector3 target,Transform prefap,string name)
    {
        time = 0;
        Card = Instantiate(prefap, f_vector, Quaternion.identity);
        Card.tag = "Card";
        Card.name = name + num;
        Card.localScale = new Vector3(0.017f, 0.1f, 0.017f);
        Card.transform.rotation = Quaternion.Euler(f_rotation);
        Vector3 s_rotation = new Vector3(0, -19, 0);
        while (time < endTime)
        {
            Card.transform.position = Vector3.Lerp(f_vector, target, time / endTime);
            Card.transform.rotation = Quaternion.Lerp(Quaternion.Euler(f_rotation), Quaternion.Euler(s_rotation), time / endTime);
            time += Time.deltaTime;
            yield return null;
        }
        Card.transform.position = target;
        Card.transform.rotation = Quaternion.Euler(s_rotation);
    }

    private IEnumerator Cardposition(int num,Vector3 target,Transform prefap,string name)
    {
        time = 0;
        Card = Instantiate(prefap, f_vector, Quaternion.identity);
        Card.tag = "Card";
        Card.name = name + num;
        Card.localScale = new Vector3(0.017f, 0.1f, 0.017f);
        Card.transform.rotation = Quaternion.Euler(f_rotation);
        while (time < endTime)
        {
            Card.transform.position = Vector3.Lerp(f_vector, target, time / endTime);
            Card.transform.rotation = Quaternion.Lerp(Quaternion.Euler(f_rotation), Quaternion.Euler(e_rotation), time / endTime);
            time += Time.deltaTime;
            yield return null;
        }
        Card.transform.position = target;
        Card.transform.rotation = Quaternion.Euler(0, 0, 0);
    }

    private void cardDestroy()
    {
        for(int i = 0; i < GameObject.FindGameObjectsWithTag("Card").Count(); i++)
        {
            Destroy(GameObject.FindGameObjectsWithTag("Card")[i]);
        }
    }
    private void playerCard()
    {
        Destroy(GameObject.Find("Cards_H"));
    }
    private void splitCard()
    {
        Destroy(GameObject.Find("Cards_S"));
    }
    private void dealerCard()
    {
        Destroy(GameObject.Find("Cards_D"));
    }

    private void buttonState()
    {
        DealButton.SetActive(apiform.dealButton);
        HitButton.SetActive(apiform.hitButton);
        StandButton.SetActive(apiform.standButton);
        SplitButton.SetActive(apiform.splitButton);
        DoubleButton.SetActive(apiform.doubleButton);
        InsuranceButton.SetActive(apiform.insuranceButton);
        ForfeitButton.SetActive(apiform.forfeitButton);
        one.SetActive(apiform.oneImage);
        two.SetActive(apiform.twoImage);
    }

    private void gameState()
    {
        if(!apiform.playerForfeit){
            if (apiform.winState == 1)
            {
                p_State.text = "Lose";
            }
            else if (apiform.winState == 2)
            {
                p_State.text = "Tie";
            }
            else if (apiform.winState == 3)
            {
                p_State.text = "Win";
            }
        }
        if(!apiform.splitForfeit){
            if (apiform.s_winState == 1)
            {
                S_State.text = "Lose";
            }
            else if (apiform.s_winState == 2)
            {
                S_State.text = "Tie";
            }
            else if (apiform.s_winState == 3)
            {
                S_State.text = "Win";
            }
        }
        if (apiform.splitCount > 0)
        {
            if (apiform.winState > 1 || apiform.s_winState >1)
            {
                if (p_moneyCheck)
                {
                    StartCoroutine(winMoney(apiform.winMoney+ apiform.insuranceMoney));
                    p_moneyCheck = false;
                }
            }
        }
        else
        {
            if (apiform.winState > 1)
            {
                if (p_moneyCheck)
                {
                    StartCoroutine(winMoney(apiform.winMoney+ apiform.insuranceMoney));
                    p_moneyCheck = false;
                }
            }
        }
    }

    private IEnumerator winMoney(float mywinMoney)
    {
        float start = 0;
        float end = 1f;
        while (start < end)
        {
            balance.text = Mathf.Floor(Mathf.Lerp(myBal, myBal + mywinMoney, (start / end))).ToString();
            yield return new WaitForEndOfFrame();
            start += Time.deltaTime;
        }
        myBal += mywinMoney;
        balance.text = myBal.ToString();
    }

    private IEnumerator myBalance()
    {
        float start = 0;
        float end = 1;
        while (start < end)
        {
            balance.text = Mathf.Floor(Mathf.Lerp(myBal, myBal-myBet, (start/ end))).ToString();
            start += Time.deltaTime;
            yield return new WaitForEndOfFrame();
        }
        myBal -= myBet;
        balance.text = (myBal).ToString();
    }

    public void RequestToken(string data)
    {
        JSONNode usersInfo = JSON.Parse(data);
        Token = usersInfo["token"];
        balance.GetComponent<Text>().text = usersInfo["amount"];
        myBal = usersInfo["amount"];
    }
}