using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Deck : MonoBehaviour
{
    // Start is called before the first frame update

    Image image;
    CardValue cardValue;
    CardSuit suit;

    public Image Image
    {
        get
        {
            return this.image;
        }
    }

    public CardValue Value
    {
        get
        {
            return this.cardValue;
        }
        set
        {
            this.cardValue = value;
            GetImage();
        }
    }

    public CardSuit Suit
    {
        get
        {
            return this.suit;
        }
        set
        {
            this.Suit = value;
            GetImage();
        }
    }

    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
