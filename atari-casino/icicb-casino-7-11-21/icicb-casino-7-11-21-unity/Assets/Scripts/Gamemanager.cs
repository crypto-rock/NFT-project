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

public class Gamemanager : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void GameReady(string msg);
    public TMP_InputField TotalAmount;
    public TMP_Text BetAmount;
    public TMP_Text Alert_top;
    public TMP_Text Alert_bottom;
    public TMP_Text[] prize_text_1 = new TMP_Text[3];
    public TMP_Text[] prize_text_2 = new TMP_Text[3];
    public GameObject disable_Play;
    public Button disable_increase;
    public Button disable_decrease;
    public GameObject Reveal;
    private float betAmount;
    private float totalAmount;
    public Texture[] R_number = new Texture[9];
    public Texture[] W_number = new Texture[9];
    public Texture[] G_number = new Texture[22];
    public GameObject[] prize_2 = new GameObject[3];
    public GameObject[] prize_3 = new GameObject[3];
    public GameObject[] S_number = new GameObject[9];
    public GameObject[] B_number = new GameObject[9];
    public GameObject[] Sum_number = new GameObject[3];
    public GameObject[] question_button = new GameObject[9];
    public GameObject[] star_button = new GameObject[3];
    public RuntimeAnimatorController[] coinAnimation = new RuntimeAnimatorController[2];
    private bool isbutton = false;
    private int isNumber = 0;
    private List<int> RandomNumber = new List<int>();
    BetPlayer _player;
    public static ReceiveJsonObject apiform;
    private string BaseUrl = "http://153.92.214.184:443";
    void Start()
    {
        betAmount = 10f;
        BetAmount.text = betAmount.ToString("F2");
        _player = new BetPlayer();
        for (int i = 0; i < 9; i++)
        {
            question_button[i].GetComponent<Animator>().runtimeAnimatorController = coinAnimation[0];
        }
#if UNITY_WEBGL == true && UNITY_EDITOR == false
        GameReady("Ready");
#endif
    }
    void Update()
    {

    }
    public void RequestToken(string data)
    {
        JSONNode usersInfo = JSON.Parse(data);
        _player.token = usersInfo["token"];
        totalAmount = float.Parse(usersInfo["amount"]);
        TotalAmount.text = totalAmount.ToString("F2");
    }
    public void Increase()
    {
        betAmount = float.Parse(BetAmount.text);
        if (betAmount >= 10f)
        {
            if (totalAmount >= betAmount + 10f && betAmount < 100f)
            {
                betAmount += 10f;
                BetAmount.text = betAmount.ToString("F2");
            }
            else if (betAmount >= 100f)
            {
                betAmount = 100f;
                Alert_top.text = "";
                Alert_bottom.text = "";
                Alert_top.text = "MAXIMUM BET LIMIT";
                Alert_bottom.text = "100.00";
            }
            else
            {
                Alert_top.text = "";
                Alert_bottom.text = "";
                Alert_top.text = "WARNING";
                Alert_bottom.text = "NOT ENOUGH BALANCE!";
            }
        }
    }
    public void Decrease()
    {
        betAmount = float.Parse(BetAmount.text);
        if (betAmount > 10 && betAmount <= 100)
        {
            betAmount -= 10f;
            BetAmount.text = betAmount.ToString("F2");
        }
        else
        {
            betAmount = 10f;
            Alert_top.text = "";
            Alert_bottom.text = "";
            Alert_top.text = "MINIMUM BET LIMIT";
            Alert_bottom.text = "10.00";
        }
    }
    public void Play()
    {
        for (int i = 0; i < 9; i++)
        {
            B_number[i].SetActive(false);
            S_number[i].SetActive(false);
            question_button[i].SetActive(true);
        }
        for (int i = 0; i < 3; i++)
        {
            star_button[i].SetActive(true);
            Sum_number[i].SetActive(false);
            prize_2[i].SetActive(false);
            prize_3[i].SetActive(false);
        }
        disable_Play.SetActive(false);
        disable_increase.interactable = false;
        disable_decrease.interactable = false;
        Reveal.SetActive(true);

        Alert_top.text = "";
        Alert_bottom.text = "";

        betAmount = float.Parse(BetAmount.text);
        if (betAmount < 0.1f)
        {
            betAmount = 0.1f;
            Alert_top.text = "";
            Alert_bottom.text = "";
            Alert_top.text = "MINIMUM BET LIMIT";
            Alert_bottom.text = "0.10";
            disable_Play.SetActive(true);
            disable_increase.interactable = true;
            disable_decrease.interactable = true;
            Reveal.SetActive(false);
        }
        else
        {
            if (totalAmount >= betAmount)
            {
                StartCoroutine(Server());
            }
            else
            {
                Alert_top.text = "";
                Alert_bottom.text = "";
                Alert_top.text = "WARNING";
                Alert_bottom.text = "NOT ENOUGH BALANCE!";
                disable_Play.SetActive(true);
                disable_increase.interactable = true;
                disable_decrease.interactable = true;
                Reveal.SetActive(false);
            }
        }
    }
    IEnumerator Server()
    {
        betAmount = float.Parse(BetAmount.text);
        WWWForm form = new WWWForm();
        form.AddField("token", _player.token);
        form.AddField("betAmount", betAmount.ToString("F2"));
        UnityWebRequest www = UnityWebRequest.Post(BaseUrl + "/api/Play", form);
        yield return www.SendWebRequest();
        if (www.result != UnityWebRequest.Result.Success)
        {
            Alert_top.text = "";
            Alert_bottom.text = "";
            Alert_top.text = "ERROR";
            Alert_bottom.text = "CANNOT FIND SERVER!";
            disable_Play.SetActive(true);
            disable_increase.interactable = true;
            disable_decrease.interactable = true;
            Reveal.SetActive(false);
        }
        else
        {
            string strdata = System.Text.Encoding.UTF8.GetString(www.downloadHandler.data);
            apiform = JsonUtility.FromJson<ReceiveJsonObject>(strdata);
            if (apiform.Message == "SUCCESS!")
            {
                isNumber = 0;
                RandomNumber.Clear();
                for (int i = 0; i < 9; i++)
                {
                    RandomNumber.Add(i);
                    question_button[i].GetComponent<Animator>().runtimeAnimatorController = coinAnimation[1];
                    if (apiform.NumbersArray[i] == 11)
                    {
                        S_number[i].GetComponent<RawImage>().texture = R_number[8];
                    }
                    else
                    {
                        S_number[i].GetComponent<RawImage>().texture = R_number[apiform.NumbersArray[i]];
                    }
                }

                for (int i = 0; i < 3; i++)
                {
                    prize_text_1[i].text = apiform.prize[i].ToString("F2");
                    prize_text_2[i].text = apiform.prize[i].ToString("F2");
                }
                isbutton = true;
            }
            else if (apiform.Message == "BET ERROR!")
            {
                Alert_top.text = "";
                Alert_bottom.text = "";
                Alert_top.text = "ERROR";
                Alert_bottom.text = "BET ERROR!";
                disable_Play.SetActive(true);
                disable_increase.interactable = true;
                disable_decrease.interactable = true;
                Reveal.SetActive(false);
            }
            else if (apiform.Message == "SERVER ERROR!")
            {
                Alert_top.text = "";
                Alert_bottom.text = "";
                Alert_top.text = "ERROR";
                Alert_bottom.text = "SERVER ERROR!";
                disable_Play.SetActive(true);
                disable_increase.interactable = true;
                disable_decrease.interactable = true;
                Reveal.SetActive(false);
            }
        }
    }
    public void handleClickNumber(int index)
    {
        if (isbutton)
        {
            isbutton = false;
            RandomNumber.Remove(index);
            StartCoroutine(_handleClickNumber(index));
        }
    }
    IEnumerator _handleClickNumber(int index, string str = "")
    {
        yield return new WaitForSeconds(0.5f);
        S_number[isNumber].SetActive(true);
        question_button[index].SetActive(false);
        if (apiform.NumbersArray[isNumber] == 11)
        {
            B_number[index].GetComponent<RawImage>().texture = W_number[8];
        }
        else
        {
            B_number[index].GetComponent<RawImage>().texture = W_number[apiform.NumbersArray[isNumber]];
        }

        switch (isNumber)
        {
            case 0:
                prize_2[0].SetActive(true);
                break;
            case 2:
                Sum_number[0].GetComponent<RawImage>().texture = G_number[apiform.SumsArray[0] - 3];
                star_button[0].SetActive(false);
                Sum_number[0].SetActive(true);
                if (apiform.SumsArray[0] == 7 || apiform.SumsArray[0] == 11 || apiform.SumsArray[0] == 21)
                {
                    prize_2[0].SetActive(false);
                    prize_3[0].SetActive(true);
                    break;
                }
                break;
            case 3:
                prize_2[1].SetActive(true);
                break;
            case 5:
                Sum_number[1].GetComponent<RawImage>().texture = G_number[apiform.SumsArray[1] - 3];
                star_button[1].SetActive(false);
                Sum_number[1].SetActive(true);
                if (apiform.SumsArray[1] == 7 || apiform.SumsArray[1] == 11 || apiform.SumsArray[1] == 21)
                {
                    prize_2[1].SetActive(false);
                    prize_3[1].SetActive(true);
                    break;
                }
                break;
            case 6:
                prize_2[2].SetActive(true);
                break;
            case 8:
                Sum_number[2].GetComponent<RawImage>().texture = G_number[apiform.SumsArray[2] - 3];
                star_button[2].SetActive(false);
                Sum_number[2].SetActive(true);
                if (apiform.SumsArray[2] == 7 || apiform.SumsArray[2] == 11 || apiform.SumsArray[2] == 21)
                {
                    prize_2[2].SetActive(false);
                    prize_3[2].SetActive(true);
                    break;
                }
                break;
        }

        B_number[index].SetActive(true);
        isNumber++;
        if (str != "Reveal")
        {
            isbutton = true;
        }
        if (isNumber >= 9)
        {
            yield return new WaitForSeconds(0.5f);
            if (apiform.earnAmount > 0.0f)
            {
                totalAmount += apiform.earnAmount - betAmount;
                TotalAmount.text = totalAmount.ToString("F2");
                Alert_top.text = "";
                Alert_bottom.text = "";
                Alert_top.text = "REWARD";
                Alert_bottom.text = apiform.earnAmount.ToString("F2");
            }
            else
            {
                totalAmount -= betAmount;
                TotalAmount.text = totalAmount.ToString("F2");
                Alert_top.text = "";
                Alert_bottom.text = "";
                Alert_top.text = "REWARD";
                Alert_bottom.text = "0.00";
            }
            disable_Play.SetActive(true);
            disable_increase.interactable = true;
            disable_decrease.interactable = true;
            Reveal.SetActive(false);
            isNumber = 0;
        }
    }
    public void RevealClick()
    {
        if (isbutton)
        {
            isbutton = false;
            StartCoroutine(_Reveal());
        }
    }
    IEnumerator _Reveal()
    {
        for (int i = isNumber; i < 9; i++)
        {
            yield return new WaitForSeconds(0.5f);
            if (isNumber == 8)
            {
                StartCoroutine(_handleClickNumber(RandomNumber[0], "Reveal"));
            }
            else
            {
                int rnd = Random.Range(0, 8 - isNumber);
                StartCoroutine(_handleClickNumber(RandomNumber[rnd], "Reveal"));
                RandomNumber.RemoveAt(rnd);
            }
        }
    }
}
public class BetPlayer
{
    public string token;
}
