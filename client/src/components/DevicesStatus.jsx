import Switch from '@mui/material/Switch';
import { usePutDeviceMutation } from '../features/api/apiSlice';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const DevicesStatus = ({ idP, status }) => {
    const [putDevice] = usePutDeviceMutation()

    return status
        ? <div onClick={() => putDevice({ idP, status })}>
            <Switch {...label} defaultChecked />
        </div>
        : <div onClick={() => putDevice({ idP, status })}>
            <Switch {...label} />
        </div>
}

export default DevicesStatus