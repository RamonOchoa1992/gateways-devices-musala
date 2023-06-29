import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useAddGatewayMutation, useGatewaysQuery } from '../features/api/apiSlice';

const initialForm = {
    serialNumber: "",
    humanName: "",
    ipAddress: ""
}


export default function DeleteForm({ setOpen }) {

    const [form, setForm] = useState(initialForm)
    const [errorSerial, setErrorSerial] = useState(false)
    const [errorAddress, setErrorAddress] = useState(false)
    const [errorRequiredS, setErrorRequiredS] = useState(false)
    const [errorRequiredH, setErrorRequiredH] = useState(false)
    const { data } = useGatewaysQuery();
    const [addGateway] = useAddGatewayMutation();

    const handleFilling = (e) => {
        setForm(
            {
                ...form,
                [e.target.name]: e.target.value
            }
        )
    }

    const accept = () => {
        let counterValidation = 0;

        if (form.serialNumber === "") {
            setErrorRequiredS(true);
            counterValidation++;
        }
        else {
            setErrorRequiredS(false);
        }

        if (form.humanName === "") {
            setErrorRequiredH(true);
            counterValidation++;
        }
        else {
            setErrorRequiredH(false)

        }

        if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(form.ipAddress)) {
            setErrorAddress(true);
            counterValidation++;
        }
        else {
            setErrorAddress(false);
        }

        let nameCounter = 0;

        if (data) {
            data.forEach(d => {
                if (d.serialNumber === form.serialNumber) {
                    nameCounter++;
                }
            })
            if (nameCounter > 0) {
                setErrorSerial(true);
                counterValidation++;
            }
            else {
                setErrorSerial(false)
            }
        }

        const adding = async () => {
            const result = await addGateway(form)
            console.log(result);
        }

        if (counterValidation === 0) {
            adding();
            setOpen(false);
        }

    }

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '95%' },
            }}
            noValidate
            autoComplete="off"
        >
            <h2 style={{ color: "rgba(3, 40, 109, 0.925)", fontSize: "1.8rem", textAlign: "center" }}>Insert Gateway</h2>
            <TextField
                required
                id={errorSerial ? "outlined-error-helper-text" : "outlined-basic"}
                label={errorSerial ? "Error" : "Serial Number"}
                variant="outlined"
                name="serialNumber"
                value={form.serialNumber}
                helperText={errorSerial ? "Incorrect entry. This serial number is already stored" : errorRequiredS ? "Required" : ""}
                error={errorSerial ? true : errorRequiredS ? true : false}
                onChange={handleFilling} />
            <TextField
                required
                id="outlined-basic"
                label="Human Name"
                variant="outlined"
                name="humanName"
                value={form.humanName}
                helperText={errorRequiredH ? "Required" : ""}
                error={errorRequiredH ? true : false}
                onChange={handleFilling} />
            <TextField
                required
                id={errorAddress ? "outlined-error-helper-text" : "outlined-basic"}
                label={errorAddress ? "Error" : "Ip Address"}
                variant="outlined"
                name="ipAddress"
                value={form.ipAddress}
                helperText={errorAddress ? "Incorrect entry. Ex: 127.0.0.1" : ""}
                error={errorAddress ? true : false}
                onChange={handleFilling} />
            <Stack spacing={2} direction="row" justifyContent="flex-end">
                <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
                <Button variant="contained" onClick={accept}>Accept</Button>
            </Stack>
        </Box>
    );
}