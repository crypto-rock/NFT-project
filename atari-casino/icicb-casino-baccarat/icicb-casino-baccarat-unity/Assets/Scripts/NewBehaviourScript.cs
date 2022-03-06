using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using UnityEngine.Networking;
using System.Runtime.InteropServices;
using SimpleJSON;

public class NewBehaviourScript : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void GameReady(string msg);

    public TMP_Text BetAmount;
    public TMP_Text TotalAmount;
    public TMP_Text aler_player;
    public TMP_Text aler_tie;
    public TMP_Text aler_banker;
    public static ReceiveJsonObject apiform;
    public Button disable_BET;
    public Button disable_clear;
    private float betAmount;
    private float totalAmount;
    private float pokerMark = 5f;
    private float player_mark = 0.0f;
    private float tie_mark = 0.0f;
    private float banker_mark = 0.0f;
    private Color color = Color.white;
    public GameObject[] color_button = new GameObject[6];
    public GameObject[] players = new GameObject[3];
    public Texture[] marks = new Texture[6];
    public Sprite[] pokers = new Sprite[2];
    public GameObject[] player_poker = new GameObject[3];
    public GameObject[] banker_poker = new GameObject[3];
    public Texture[] Hearts = new Texture[13];
    public Texture[] Spades = new Texture[13];
    public Texture[] Diamonds = new Texture[13];
    public Texture[] Clubs = new Texture[13];
    private string BaseUrl = "http://153.92.214.184";
    private int flag = 0;
    BetPlayer __player;
    void Start()
    {
        betAmount = 0f;
        BetAmount.text = betAmount.ToString("F2");
        disable_clear.interactable = false;
        color.a = 0.3f;
        color_button[0].GetComponent<Image>().color = color;
        __player = new BetPlayer();
#if UNITY_WEBGL == true && UNITY_EDITOR == false
        GameReady("Ready");
#endif
    }
    void Update()
    {
        if (flag == 0)
        {
            if (betAmount > 0f)
            {
                disable_clear.interactable = true;
            }
            else
            {
                disable_clear.interactable = false;
            }
        }
        else
        {
            disable_clear.interactable = false;
        }
    }
    public void RequestToken(string data)
    {
        JSONNode usersInfo = JSON.Parse(data);
        __player.token = usersInfo["token"];
        totalAmount = float.Parse(usersInfo["amount"]);
        TotalAmount.text = totalAmount.ToString("F2");
    }
    public void player()
    {
        if (flag == 0)
        {
            StartCoroutine(_player());
        }
    }
    IEnumerator _player()
    {
        if ((betAmount + pokerMark > totalAmount) && totalAmount > 5f)
        {
            aler_player.text = "WARNING";
            aler_tie.text = "MAXIMUM BET LIMIT";
            aler_banker.text = totalAmount.ToString("F2") + " !";
            yield return new WaitForSeconds(2f);
            aler_player.text = player_mark.ToString("F2");
            aler_tie.text = tie_mark.ToString("F2");
            aler_banker.text = banker_mark.ToString("F2");
        }
        else if (totalAmount < 5f)
        {
            aler_player.text = "WARNING";
            aler_tie.text = "NOT ENOUGH";
            aler_banker.text = "BALANCE !";
        }
        else
        {
            if (pokerMark == 5f)
            {
                betAmount += 5f;
                player_mark += 5f;
                BetAmount.text = betAmount.ToString("F2");
                aler_player.text = player_mark.ToString("F2");
                aler_tie.text = tie_mark.ToString("F2");
                aler_banker.text = banker_mark.ToString("F2");
                players[0].GetComponent<RawImage>().texture = marks[0];
                players[0].GetComponent<RawImage>().color = Color.white;
            }
            else if (pokerMark == 10f)
            {
                betAmount += 10f;
                player_mark += 10f;
                BetAmount.text = betAmount.ToString("F2");
                aler_player.text = player_mark.ToString("F2");
                aler_tie.text = tie_mark.ToString("F2");
                aler_banker.text = banker_mark.ToString("F2");
                players[0].GetComponent<RawImage>().texture = marks[1];
                players[0].GetComponent<RawImage>().color = Color.white;
            }
            else if (pokerMark == 20f)
            {
                betAmount += 20f;
                player_mark += 20f;
                BetAmount.text = betAmount.ToString("F2");
                aler_player.text = player_mark.ToString("F2");
                aler_tie.text = tie_mark.ToString("F2");
                aler_banker.text = banker_mark.ToString("F2");
                players[0].GetComponent<RawImage>().texture = marks[2];
                players[0].GetComponent<RawImage>().color = Color.white;
            }
            else if (pokerMark == 50f)
            {
                betAmount += 50f;
                player_mark += 50f;
                BetAmount.text = betAmount.ToString("F2");
                aler_player.text = player_mark.ToString("F2");
                aler_tie.text = tie_mark.ToString("F2");
                aler_banker.text = banker_mark.ToString("F2");
                players[0].GetComponent<RawImage>().texture = marks[3];
                players[0].GetComponent<RawImage>().color = Color.white;
            }
            else if (pokerMark == 100f)
            {
                betAmount += 100f;
                player_mark += 100f;
                BetAmount.text = betAmount.ToString("F2");
                aler_player.text = player_mark.ToString("F2");
                aler_tie.text = tie_mark.ToString("F2");
                aler_banker.text = banker_mark.ToString("F2");
                players[0].GetComponent<RawImage>().texture = marks[4];
                players[0].GetComponent<RawImage>().color = Color.white;
            }
            else if (pokerMark == 500f)
            {
                betAmount += 500f;
                player_mark += 500f;
                BetAmount.text = betAmount.ToString("F2");
                aler_player.text = player_mark.ToString("F2");
                aler_tie.text = tie_mark.ToString("F2");
                aler_banker.text = banker_mark.ToString("F2");
                players[0].GetComponent<RawImage>().texture = marks[5];
                players[0].GetComponent<RawImage>().color = Color.white;
            }
        }
    }
    public void tie()
    {
        if (flag == 0)
        {
            StartCoroutine(_tie());
        }
    }
    IEnumerator _tie()
    {
        if ((betAmount + pokerMark > totalAmount) && totalAmount > 5f)
        {
            aler_player.text = "WARNING";
            aler_tie.text = "MAXIMUM BET LIMIT";
            aler_banker.text = totalAmount.ToString("F2") + " !";
            yield return new WaitForSeconds(2f);
            aler_player.text = player_mark.ToString("F2");
            aler_tie.text = tie_mark.ToString("F2");
            aler_banker.text = banker_mark.ToString("F2");
        }
        else if (totalAmount < 5f)
        {
            aler_player.text = "WARNING";
            aler_tie.text = "NOT ENOUGH";
            aler_banker.text = "BALANCE !";
        }
        else
        {
            if (pokerMark == 5f)
            {
                betAmount += 5f;
                tie_mark += 5f;
                BetAmount.text = betAmount.ToString("F2");
                aler_player.text = player_mark.ToString("F2");
                aler_tie.text = tie_mark.ToString("F2");
                aler_banker.text = banker_mark.ToString("F2");
                players[1].GetComponent<RawImage>().texture = marks[0];
                players[1].GetComponent<RawImage>().color = Color.white;
            }
            else if (pokerMark == 10f)
            {
                betAmount += 10f;
                tie_mark += 10f;
                BetAmount.text = betAmount.ToString("F2");
                aler_player.text = player_mark.ToString("F2");
                aler_tie.text = tie_mark.ToString("F2");
                aler_banker.text = banker_mark.ToString("F2");
                players[1].GetComponent<RawImage>().texture = marks[1];
                players[1].GetComponent<RawImage>().color = Color.white;
            }
            else if (pokerMark == 20f)
            {
                betAmount += 20f;
                tie_mark += 20f;
                BetAmount.text = betAmount.ToString("F2");
                aler_player.text = player_mark.ToString("F2");
                aler_tie.text = tie_mark.ToString("F2");
                aler_banker.text = banker_mark.ToString("F2");
                players[1].GetComponent<RawImage>().texture = marks[2];
                players[1].GetComponent<RawImage>().color = Color.white;
            }
            else if (pokerMark == 50f)
            {
                betAmount += 50f;
                tie_mark += 50f;
                BetAmount.text = betAmount.ToString("F2");
                aler_player.text = player_mark.ToString("F2");
                aler_tie.text = tie_mark.ToString("F2");
                aler_banker.text = banker_mark.ToString("F2");
                players[1].GetComponent<RawImage>().texture = marks[3];
                players[1].GetComponent<RawImage>().color = Color.white;
            }
            else if (pokerMark == 100f)
            {
                betAmount += 100f;
                tie_mark += 100f;
                BetAmount.text = betAmount.ToString("F2");
                aler_player.text = player_mark.ToString("F2");
                aler_tie.text = tie_mark.ToString("F2");
                aler_banker.text = banker_mark.ToString("F2");
                players[1].GetComponent<RawImage>().texture = marks[4];
                players[1].GetComponent<RawImage>().color = Color.white;
            }
            else if (pokerMark == 500f)
            {
                betAmount += 500f;
                tie_mark += 500f;
                BetAmount.text = betAmount.ToString("F2");
                aler_player.text = player_mark.ToString("F2");
                aler_tie.text = tie_mark.ToString("F2");
                aler_banker.text = banker_mark.ToString("F2");
                players[1].GetComponent<RawImage>().texture = marks[5];
                players[1].GetComponent<RawImage>().color = Color.white;
            }
        }
    }
    public void banker()
    {
        if (flag == 0)
        {
            StartCoroutine(_banker());
        }
    }
    IEnumerator _banker()
    {
        if ((betAmount + pokerMark > totalAmount) && totalAmount > 5f)
        {
            aler_player.text = "WARNING";
            aler_tie.text = "MAXIMUM BET LIMIT";
            aler_banker.text = totalAmount.ToString("F2") + " !";
            yield return new WaitForSeconds(2f);
            aler_player.text = player_mark.ToString("F2");
            aler_tie.text = tie_mark.ToString("F2");
            aler_banker.text = banker_mark.ToString("F2");
        }
        else if (totalAmount < 5f)
        {
            aler_player.text = "WARNING";
            aler_tie.text = "NOT ENOUGH";
            aler_banker.text = "BALANCE !";
        }
        else
        {
            if (pokerMark == 5f)
            {
                betAmount += 5f;
                banker_mark += 5f;
                BetAmount.text = betAmount.ToString("F2");
                aler_player.text = player_mark.ToString("F2");
                aler_tie.text = tie_mark.ToString("F2");
                aler_banker.text = banker_mark.ToString("F2");
                players[2].GetComponent<RawImage>().texture = marks[0];
                players[2].GetComponent<RawImage>().color = Color.white;
            }
            else if (pokerMark == 10f)
            {
                betAmount += 10f;
                banker_mark += 10f;
                BetAmount.text = betAmount.ToString("F2");
                aler_player.text = player_mark.ToString("F2");
                aler_tie.text = tie_mark.ToString("F2");
                aler_banker.text = banker_mark.ToString("F2");
                players[2].GetComponent<RawImage>().texture = marks[1];
                players[2].GetComponent<RawImage>().color = Color.white;
            }
            else if (pokerMark == 20f)
            {
                betAmount += 20f;
                banker_mark += 20f;
                BetAmount.text = betAmount.ToString("F2");
                aler_player.text = player_mark.ToString("F2");
                aler_tie.text = tie_mark.ToString("F2");
                aler_banker.text = banker_mark.ToString("F2");
                players[2].GetComponent<RawImage>().texture = marks[2];
                players[2].GetComponent<RawImage>().color = Color.white;
            }
            else if (pokerMark == 50f)
            {
                betAmount += 50f;
                banker_mark += 50f;
                BetAmount.text = betAmount.ToString("F2");
                aler_player.text = player_mark.ToString("F2");
                aler_tie.text = tie_mark.ToString("F2");
                aler_banker.text = banker_mark.ToString("F2");
                players[2].GetComponent<RawImage>().texture = marks[3];
                players[2].GetComponent<RawImage>().color = Color.white;
            }
            else if (pokerMark == 100f)
            {
                betAmount += 100f;
                banker_mark += 100f;
                BetAmount.text = betAmount.ToString("F2");
                aler_player.text = player_mark.ToString("F2");
                aler_tie.text = tie_mark.ToString("F2");
                aler_banker.text = banker_mark.ToString("F2");
                players[2].GetComponent<RawImage>().texture = marks[4];
                players[2].GetComponent<RawImage>().color = Color.white;
            }
            else if (pokerMark == 500f)
            {
                betAmount += 500f;
                banker_mark += 500f;
                BetAmount.text = betAmount.ToString("F2");
                aler_player.text = player_mark.ToString("F2");
                aler_tie.text = tie_mark.ToString("F2");
                aler_banker.text = banker_mark.ToString("F2");
                players[2].GetComponent<RawImage>().texture = marks[5];
                players[2].GetComponent<RawImage>().color = Color.white;
            }
        }
    }
    public void clear()
    {
        color.a = 0f;
        betAmount = 0f;
        player_mark = 0f;
        tie_mark = 0f;
        banker_mark = 0f;
        BetAmount.text = betAmount.ToString("F2");
        aler_player.text = player_mark.ToString("F2");
        aler_tie.text = tie_mark.ToString("F2");
        aler_banker.text = banker_mark.ToString("F2");
        players[0].GetComponent<RawImage>().texture = null;
        players[0].GetComponent<RawImage>().color = color;
        players[1].GetComponent<RawImage>().texture = null;
        players[1].GetComponent<RawImage>().color = color;
        players[2].GetComponent<RawImage>().texture = null;
        players[2].GetComponent<RawImage>().color = color;
    }
    public void mark1()
    {
        pokerMark = 5;

        color.a = 0.3f;
        color_button[0].GetComponent<Image>().color = color;
        color_button[1].GetComponent<Image>().color = Color.white;
        color_button[2].GetComponent<Image>().color = Color.white;
        color_button[3].GetComponent<Image>().color = Color.white;
        color_button[4].GetComponent<Image>().color = Color.white;
        color_button[5].GetComponent<Image>().color = Color.white;
    }
    public void mark2()
    {
        pokerMark = 10;
        color_button[0].GetComponent<Image>().color = Color.white;
        color.a = 0.3f;
        color_button[1].GetComponent<Image>().color = color;
        color_button[2].GetComponent<Image>().color = Color.white;
        color_button[3].GetComponent<Image>().color = Color.white;
        color_button[4].GetComponent<Image>().color = Color.white;
        color_button[5].GetComponent<Image>().color = Color.white;
    }
    public void mark3()
    {
        pokerMark = 20;
        color_button[0].GetComponent<Image>().color = Color.white;
        color_button[1].GetComponent<Image>().color = Color.white;
        color.a = 0.3f;
        color_button[2].GetComponent<Image>().color = color;
        color_button[3].GetComponent<Image>().color = Color.white;
        color_button[4].GetComponent<Image>().color = Color.white;
        color_button[5].GetComponent<Image>().color = Color.white;
    }
    public void mark4()
    {
        pokerMark = 50;
        color_button[0].GetComponent<Image>().color = Color.white;
        color_button[1].GetComponent<Image>().color = Color.white;
        color_button[2].GetComponent<Image>().color = Color.white;
        color.a = 0.3f;
        color_button[3].GetComponent<Image>().color = color;
        color_button[4].GetComponent<Image>().color = Color.white;
        color_button[5].GetComponent<Image>().color = Color.white;
    }
    public void mark5()
    {
        pokerMark = 100;
        color_button[0].GetComponent<Image>().color = Color.white;
        color_button[1].GetComponent<Image>().color = Color.white;
        color_button[2].GetComponent<Image>().color = Color.white;
        color_button[3].GetComponent<Image>().color = Color.white;
        color.a = 0.3f;
        color_button[4].GetComponent<Image>().color = color;
        color_button[5].GetComponent<Image>().color = Color.white;
    }
    public void mark6()
    {
        pokerMark = 500;
        color_button[0].GetComponent<Image>().color = Color.white;
        color_button[1].GetComponent<Image>().color = Color.white;
        color_button[2].GetComponent<Image>().color = Color.white;
        color_button[3].GetComponent<Image>().color = Color.white;
        color_button[4].GetComponent<Image>().color = Color.white;
        color.a = 0.3f;

        color_button[5].GetComponent<Image>().color = color;
    }
    public void BET()
    {
        disable_BET.interactable = false;
        for (int i = 0; i < 3; i++)
        {
            color.a = 0f;
            player_poker[i].GetComponent<RawImage>().texture = null;
            player_poker[i].GetComponent<RawImage>().color = color;
            banker_poker[i].GetComponent<RawImage>().texture = null;
            banker_poker[i].GetComponent<RawImage>().color = color;
        }
        aler_player.text = "";
        aler_tie.text = "";
        aler_banker.text = "";
        flag = 1;
        if (betAmount <= 0f)
        {
            aler_player.text = "WARNING";
            aler_tie.text = "MINIMUM BET LIMIT";
            aler_banker.text = "5.00 !";
            disable_BET.interactable = true;
            flag = 0;
        }
        else if (totalAmount < 5f)
        {
            aler_player.text = "WARNING";
            aler_tie.text = "NOT ENOUGH";
            aler_banker.text = "BALANCE !";
            disable_BET.interactable = true;
            flag = 0;
        }
        else if (betAmount > totalAmount)
        {
            aler_player.text = "WARNING";
            aler_tie.text = "NOT ENOUGH";
            aler_banker.text = "BALANCE !";
            disable_BET.interactable = true;
            flag = 0;
        }
        else
        {
            StartCoroutine(Server());
        }
    }
    IEnumerator Server()
    {
        WWWForm form = new WWWForm();
        form.AddField("token", __player.token);
        form.AddField("betAmount", betAmount.ToString("F2"));
        form.AddField("player_mark", player_mark.ToString("F2"));
        form.AddField("tie_mark", tie_mark.ToString("F2"));
        form.AddField("banker_mark", banker_mark.ToString("F2"));

        UnityWebRequest www = UnityWebRequest.Post(BaseUrl + "/api/BET", form);

        yield return www.SendWebRequest();

        if (www.result != UnityWebRequest.Result.Success)
        {
            aler_player.text = "ERROR";
            aler_tie.text = "CANNOT FIND";
            aler_banker.text = "SERVER !";
            disable_BET.interactable = true;
            flag = 0;
        }
        else
        {
            string strdata = System.Text.Encoding.UTF8.GetString(www.downloadHandler.data);
            apiform = JsonUtility.FromJson<ReceiveJsonObject>(strdata);
            if (apiform.Message == "SUCCESS!")
            {
                int p_length = apiform.player.Length;
                int b_length = apiform.banker.Length;
                for (int i = 0; i < 6; i++)
                {
                    if (i % 2 == 0)
                    {
                        continue;
                    }
                    else
                    {
                        yield return new WaitForSeconds(0.5f);
                        if (i <= p_length)
                        {
                            if (apiform.player[i] == 0)
                            {
                                player_poker[(i + 1) / 2 - 1].GetComponent<RawImage>().texture = Hearts[apiform.player[i - 1]];
                                player_poker[(i + 1) / 2 - 1].GetComponent<RawImage>().color = Color.white;

                            }
                            else if (apiform.player[i] == 1)
                            {
                                player_poker[(i + 1) / 2 - 1].GetComponent<RawImage>().texture = Spades[apiform.player[i - 1]];
                                player_poker[(i + 1) / 2 - 1].GetComponent<RawImage>().color = Color.white;
                            }
                            else if (apiform.player[i] == 2)
                            {
                                player_poker[(i + 1) / 2 - 1].GetComponent<RawImage>().texture = Clubs[apiform.player[i - 1]];
                                player_poker[(i + 1) / 2 - 1].GetComponent<RawImage>().color = Color.white;
                            }
                            else if (apiform.player[i] == 3)
                            {
                                player_poker[(i + 1) / 2 - 1].GetComponent<RawImage>().texture = Diamonds[apiform.player[i - 1]];
                                player_poker[(i + 1) / 2 - 1].GetComponent<RawImage>().color = Color.white;
                            }
                        }
                        if (i <= b_length)
                        {
                            if (apiform.banker[i] == 0)
                            {
                                banker_poker[(i + 1) / 2 - 1].GetComponent<RawImage>().texture = Hearts[apiform.banker[i - 1]];
                                banker_poker[(i + 1) / 2 - 1].GetComponent<RawImage>().color = Color.white;
                            }
                            else if (apiform.banker[i] == 1)
                            {
                                banker_poker[(i + 1) / 2 - 1].GetComponent<RawImage>().texture = Spades[apiform.banker[i - 1]];
                                banker_poker[(i + 1) / 2 - 1].GetComponent<RawImage>().color = Color.white;

                            }
                            else if (apiform.banker[i] == 2)
                            {
                                banker_poker[(i + 1) / 2 - 1].GetComponent<RawImage>().texture = Clubs[apiform.banker[i - 1]];
                                banker_poker[(i + 1) / 2 - 1].GetComponent<RawImage>().color = Color.white;

                            }
                            else if (apiform.banker[i] == 3)
                            {
                                banker_poker[(i + 1) / 2 - 1].GetComponent<RawImage>().texture = Diamonds[apiform.banker[i - 1]];
                                banker_poker[(i + 1) / 2 - 1].GetComponent<RawImage>().color = Color.white;

                            }
                        }
                    }
                }
                yield return new WaitForSeconds(0.5f);
                if (apiform.reward == 0)
                {
                    aler_player.text = apiform.player_sum.ToString();
                    aler_tie.text = "<";
                    aler_banker.text = apiform.banker_sum.ToString();
                }
                else if (apiform.reward == 1)
                {
                    aler_player.text = apiform.player_sum.ToString();
                    aler_tie.text = "TIE";
                    aler_banker.text = apiform.banker_sum.ToString();
                }
                else if (apiform.reward == 2)
                {
                    aler_player.text = apiform.player_sum.ToString();
                    aler_tie.text = ">";
                    aler_banker.text = apiform.banker_sum.ToString();
                }
                yield return new WaitForSeconds(2f);
                if (apiform.reward == 0)
                {
                    aler_player.text = "RESULT";
                    aler_tie.text = "BANKER WIN";
                    if ((apiform.earnAmount - betAmount) > 0f)
                    {
                        aler_banker.text = "REWARD : " + (apiform.earnAmount - betAmount).ToString("F2");
                    }
                    else
                    {
                        aler_banker.text = "REWARD : 0.00";
                    }
                }
                else if (apiform.reward == 1)
                {
                    aler_player.text = "RESULT";
                    aler_tie.text = "TIE";
                    if ((apiform.earnAmount - betAmount) > 0f)
                    {
                        aler_banker.text = apiform.tie_random + " X : " + betAmount.ToString("F2");
                    }
                    else
                    {
                        aler_banker.text = "REWARD : 0.00";
                    }
                }
                else if (apiform.reward == 2)
                {
                    aler_player.text = "RESULT";
                    aler_tie.text = "PLAYER WIN";
                    if ((apiform.earnAmount - betAmount) > 0f)
                    {
                        aler_banker.text = "REWARD : " + (apiform.earnAmount - betAmount).ToString("F2");
                    }
                    else
                    {
                        aler_banker.text = "REWARD : 0.00";
                    }
                }
                totalAmount += apiform.earnAmount - betAmount;
                TotalAmount.text = totalAmount.ToString("F2");
                disable_BET.interactable = true;
                flag = 0;

            }
            else if (apiform.Message == "BET ERROR!")
            {
                aler_player.text = "";
                aler_tie.text = "BET ERROR!";
                aler_banker.text = "";
                disable_BET.interactable = true;
                flag = 0;
            }
            else if (apiform.Message == "SERVER ERROR!")
            {
                aler_player.text = "";
                aler_tie.text = "SERVER ERROR!";
                aler_banker.text = "";
                disable_BET.interactable = true;
                flag = 0;
            }
        }
    }
}
public class BetPlayer
{
    public string token;
}
