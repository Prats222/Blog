import React, { useState, useContext } from 'react';
import { TextField, Box, Button, Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API } from '../../service/api';
import { DataContext } from '../../context/DataProvider';

const Component = styled(Box)`
    width: 400px;
    margin: auto;
    box-shadow: 5px 2px 5px 2px rgb(0 0 0/ 0.6);
`;

const Image = styled('img')({
    width: 100,
    display: 'flex',
    margin: 'auto',
    padding: '50px 0 0'
});

const Wrapper = styled(Box)`
    padding: 25px 35px;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    & > div, & > button, & > p {
        margin-top: 20px;
    }
`;

const LoginButton = styled(Button)`
    text-transform: none;
    background: #FB641B;
    color: #fff;
    height: 48px;
    border-radius: 2px;
`;

const SignupButton = styled(Button)`
    text-transform: none;
    background: #fff;
    color: #2874f0;
    height: 48px;
    border-radius: 2px;
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%);
`;

const Text = styled(Typography)`
    color: #878787;
    font-size: 12px;
`;

const Error = styled(Typography)`
    font-size: 10px;
    color: #ff6161;
    line-height: 0;
    margin-top: 10px;
    font-weight: 600;
`;

const Login = ({ isUserAuthenticated }) => {
    const [login, setLogin] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { setAccount } = useContext(DataContext);
    const navigate = useNavigate();

    const imageURL = 'https://www.sesta.it/wp-content/uploads/2021/03/logo-blog-sesta-trasparente.png';

    const handleLogin = async () => {
        try {
            const response = await API.userLogin(login);
            if (response.isSuccess) {
                setError('');
                sessionStorage.setItem('accessToken', `Bearer ${response.data.accessToken}`);
                sessionStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
                setAccount({ name: response.data.name, username: response.data.username });
                isUserAuthenticated(true);
                setLogin({ username: '', password: '' });
                navigate('/');
            } else {
                setError('Invalid credentials. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Something went wrong! Please try again later.');
        }
    };

    return (
        <Component>
            <Box>
                <Image src={imageURL} alt="blog" />
                <Wrapper>
                    <TextField
                        variant="standard"
                        value={login.username}
                        onChange={(e) => setLogin({ ...login, username: e.target.value })}
                        name='username'
                        label='Enter Username'
                    />
                    <TextField
                        variant="standard"
                        value={login.password}
                        onChange={(e) => setLogin({ ...login, password: e.target.value })}
                        name='password'
                        label='Enter Password'
                    />

                    {error && <Error>{error}</Error>}

                    <LoginButton variant="contained" onClick={handleLogin}>Login</LoginButton>
                    <Text style={{ textAlign: 'center' }}>OR</Text>
                    <SignupButton onClick={() => navigate('/signup')} style={{ marginBottom: 50 }}>Create an account</SignupButton>
                </Wrapper>
            </Box>
        </Component>
    );
};

export default Login;
