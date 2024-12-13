import { useState } from 'react';
import { Alert, AlertTitle, Container, TextField, Button, Typography, Box } from '@mui/material';

const EditUser = ({ userId, onClose, onSave, User }) => {
    const [user, setUser] = useState(User);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`https://reqres.in/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            setSuccess('User updated successfully');
            setTimeout(() => {
                onSave(user); // Pass updated user data to the parent
            }, 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    if (!user) {
        return <Typography align="center" variant="h6">User not found</Typography>;
    }

    return (
        <Container maxWidth="sm">
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    <AlertTitle>Error</AlertTitle>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    <AlertTitle>Success</AlertTitle>
                    {success}
                </Alert>
            )}

            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Box width="100%">
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="First Name"
                            value={user.first_name}
                            onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                            fullWidth
                            margin="normal"
                            required
                        />

                        <TextField
                            label="Last Name"
                            value={user.last_name}
                            onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                            fullWidth
                            margin="normal"
                            required
                        />

                        <TextField
                            label="Email"
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            fullWidth
                            margin="normal"
                            required
                        />

                        <Box display="flex" justifyContent="center" mt={2}>
                            <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
                                Save Changes
                            </Button>
                            <Button variant="contained" color="secondary" onClick={onClose}>
                                Cancel
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Container>
    );
};

export default EditUser;
