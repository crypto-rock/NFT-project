
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
export default function AlertDialog(props) {
    const {title,info,open,handleClose} = props;

    return (
        <Dialog onClose={handleClose} open={open}>
            <div className = "alert-modal">
                <div className = "alert-title">{title}</div>
                <div className = "alert-info">{info}</div>
            </div>
        </Dialog>
        )
}