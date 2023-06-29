import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useSelector } from 'react-redux'
import { useAddDeviceMutation } from '../features/api/apiSlice';

export default function AddFormDev({ setOpen }) {

    const idGatStatus = useSelector(state => state.hideGateway.idGat);
    const initialForm = {
        vendor: "",
        idGat: idGatStatus
    }
    const [form, setForm] = useState(initialForm)
    const [errorRequiredV, setErrorRequiredV] = useState(false)
    const [addDevice] = useAddDeviceMutation();

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

        if (form.vendor === "") {
            setErrorRequiredV(true);
            counterValidation++;
        }
        else {
            setErrorRequiredV(false)

        }
        const adding = async () => {
            await addDevice(form);

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
            <h2 style={{ color: "rgba(3, 40, 109, 0.925)", fontSize: "1.8rem", textAlign: "center" }}>Insert Device</h2>
            <TextField
                required
                id="outlined-basic"
                label="Vendor"
                variant="outlined"
                name="vendor"
                value={form.vendor}
                helperText={errorRequiredV ? "Required" : ""}
                error={errorRequiredV ? true : false}
                onChange={handleFilling} />

            <Stack spacing={2} direction="row" justifyContent="flex-end">
                <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={accept}>
                    Accept
                </Button>
            </Stack>
        </Box>
    );
}