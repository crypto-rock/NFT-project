using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class onClick : MonoBehaviour
{
    public void btnClick(int index)
    {
        GameObject gameManager = GameObject.Find("GameManager");
        gameManager.GetComponent<Gamemanager>().handleClickNumber(index);
    }
}
