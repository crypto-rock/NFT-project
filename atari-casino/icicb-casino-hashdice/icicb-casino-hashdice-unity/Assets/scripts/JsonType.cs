using UnityEngine;
using System.Collections;

public class JsonType
{
    public string userName;
    public float betAmount;
    public int stateFlag;
    public float chance;
    public int compareNum;
    public string token;
    public float amount;
}

public class ReceiveJsonObject
{
    public double amount;
    public bool gameResult;
    public float earnAmount;
    public int randomNumber;
    public string errMessage;
    public ReceiveJsonObject()
    {
    }
    public static ReceiveJsonObject CreateFromJSON(string data)
    {
        return JsonUtility.FromJson<ReceiveJsonObject>(data);
    }
}