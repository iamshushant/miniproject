import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { selectUser } from './Features/UserAuth/UserSlice';
import Select from 'react-select';

const AddNewMedic = ({ open, onClose }) => {

    const user = useSelector(selectUser);
    // const dispatch = useDispatch();

    const [medicname, setMedicname] = useState('');
    const [user_name, setUser_name] = useState('');
    const [loc, setLoc] = useState('');
    const [pass, setPass] = useState('');
    const [role, setRole] = useState('');


    
    const rolefunc = (opts) => {
        // setRole(opts);
        setRole(opts);
        // let x = Object.values(opts);
        // formData.medicname = [...x];
    }
    // console.log(role.value);
    const optrole = [
        { value: 'medic', label: 'Medic' },
        { value: 'doctor', label: 'Doctor' },
    ]


    const handleSubmit = async (e) => {

        e.preventDefault();
        // console.log('Form data:', formData);
        try {
            console.log('medic data saving...');
            if (medicname === '' || user_name === '' || loc === '' || pass === '' || role === '') {
                alert('Please fill all the fields');
                return;
            }

            const response =
                await axios.post('https://cms-backend-five.vercel.app/api/auth/register', 
                {
                    name: medicname,
                    username: user_name,
                    region: loc,
                    password: pass,
                    role: role?.value
                }
                , {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.accessToken}`
                    }
                });
            
            console.log('medic data saved');

            setMedicname('');
            setUser_name('');
            setLoc('');
            setPass('');
            setRole('');


            notifysuccess();
            onClose();


        } catch (error) {
            console.error('Error adding Jawaan:', error);
        }
    };

    const close = () => {
        setMedicname('');
        setUser_name('');
        setLoc('');
        setPass('');
        setRole('');
        onClose();
    }



    const notifysuccess = () => {
        toast.success("Medic Added", {})
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth
            style={
                {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Poppins', 
                }
            }
        >

            <ToastContainer />

            <DialogTitle fontStyle={{
                fontSize: 25,
                fontWeight: 600,
                fontFamily: 'Poppins',
                color: "primary"
            }}>Add New Medic Data</DialogTitle>
            <DialogContent>
                <form>

                    {/* Medic Name */}
                    <TextField
                        label="Medic Name"
                        fullWidth
                        value={medicname}
                        onChange={(e) => { setMedicname(e.target.value) }}
                        margin="normal"
                        required
                    />

                    {/* Username */}
                    <TextField
                        label="Username"
                        fullWidth
                        value={user_name}
                        onChange={(e) => setUser_name(e.target.value)}
                        margin="normal"
                        required
                    />

                    {/* Region */}
                    <TextField
                        label="Region"
                        fullWidth
                        value={loc}
                        onChange={(e) => setLoc(e.target.value)}
                        margin="normal"
                        required
                    />

                    {/* Passowrd */}
                    <TextField
                        label="Passowrd"
                        type='password'
                        fullWidth
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        margin="normal"
                        required
                    />

                    <Box sx={{ width: '100%' }}>
                        <Typography sx={{ fontWeight: 600 }}>Role : </Typography>
                        <Box className="roles">
                        <Select
                            // defaultValue={opt}
                            name="roles"
                            options={optrole}
                            onChange={rolefunc}
                            value={role}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Choose your role..."
                            required
                        />
                        </Box>
                    </Box>
                </form>
            </DialogContent>

            {/* Action Buttons */}
            <DialogActions>
                <Button onClick={close}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} color="primary">Add +</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddNewMedic;
