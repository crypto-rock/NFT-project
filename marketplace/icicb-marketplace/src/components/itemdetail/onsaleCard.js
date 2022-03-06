
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';

import { useEffect, useState } from 'react'

import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import CircularProgress from '@material-ui/core/CircularProgress';

// import {WeaponNFT,MarketPlace} from "../../contract"

const OnsaleCard = (props) => {
    const { action } = props;
    const [price, setPrice] = useState(200);
    const [date, setDate] = useState(new Date('2021-08-20T21:11:54'));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        var date = new Date();
        var endDate = new Date();
        endDate.setDate(date.getDate() + 7);
        setDate(endDate);
    }, [])


    const handleAction = async () => {
        setLoading(true);
        var seconds = Math.floor(date.getTime() / 1000);
        await action.action(price, seconds);
        setLoading(false);
    }

    const handlePrice = (e) => {
        if (isNaN(e.target.value) !== true) {
            setPrice(e.target.value);
        }
    }

    const handleDate = (date) => {
        console.log(typeof (date))
        setDate(date);
    }

    return (
        <div>
            <div>
                <TextField
                    label="Price"
                    InputProps={{
                        endAdornment: <InputAdornment position="end">IVX</InputAdornment>,
                    }}
                    onChange={handlePrice}
                    value={price}
                />
            </div>
            <div>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="End"
                        format="MM/dd/yyyy"
                        value={date}
                        onChange={handleDate}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </MuiPickersUtilsProvider>
            </div>
            <div className="spacer"></div>
            <Grid container>
                <Grid item xs={12} sm={12} md={12}>
                    <Button className="onsale-button" onClick={handleAction}>
                        {loading ?
                            <CircularProgress size={24} />
                            : action.name}
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default OnsaleCard;