import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    Divider,
    Box,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import { CheckCircle, Star, Whatshot } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostPackagePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [packages, setPackages] = useState([]);
    const [fetchingPackages, setFetchingPackages] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/packages/active');
                setPackages(response.data);
            } catch (err) {
                console.error('Error fetching packages:', err);
                setError(err.response?.data?.error || 'Lỗi khi tải danh sách gói bài đăng');
            } finally {
                setFetchingPackages(false);
            }
        };

        fetchPackages();
    }, []);

    const handleBuyPackage = async (pkgId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:5000/api/packages/payment', {
                packageId: pkgId
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Chuyển hướng đến trang thanh toán VNPay
            window.location.href = response.data.paymentUrl;

        } catch (err) {
            console.error('Payment error:', err);
            setError(err.response?.data?.error || 'Lỗi khi xử lý thanh toán');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                Các Gói Bài Đăng
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                Chọn gói phù hợp với nhu cầu của bạn
            </Typography>

            {/* Thông báo lỗi */}
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            {fetchingPackages ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={4} justifyContent="center">
                    {packages.map((pkg) => (
                        <Grid item xs={12} sm={6} md={4} key={pkg._id}>
                            <Card
                                elevation={pkg.popular ? 6 : 3}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: pkg.popular ? '2px solid #ff9800' : 'none',
                                    position: 'relative',
                                    overflow: 'visible',
                                    pt: pkg.popular ? 2 : 0
                                }}
                            >
                                {pkg.popular && (
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 16,
                                        transform: 'translateY(-50%)',
                                        zIndex: 1
                                    }}>
                                        <Chip
                                            label="PHỔ BIẾN"
                                            color="warning"
                                            icon={<Whatshot />}
                                            sx={{
                                                fontWeight: 'bold',
                                                fontSize: '0.75rem',
                                                boxShadow: 3,
                                                height: 28
                                            }}
                                        />
                                    </Box>
                                )}

                                {!pkg.isActive && (
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 1
                                    }}>
                                        <Chip label="TẠM NGỪNG" color="error" size="medium" />
                                    </Box>
                                )}

                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                                            {pkg.name}
                                        </Typography>
                                        {pkg.popular && <Star color="warning" />}
                                    </Box>

                                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                                        {pkg.description}
                                    </Typography>

                                    <Typography variant="h4" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                                        {pkg.price.toLocaleString('vi-VN')}₫
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                            Thời hạn: {pkg.duration} ngày
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                            Số bài: {pkg.postLimit}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 'medium' }}>
                                        Tính năng:
                                    </Typography>

                                    <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                                        {pkg.features.map((feature, index) => (
                                            <Box component="li" key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <CheckCircle color="success" fontSize="small" sx={{ mr: 1 }} />
                                                <Typography variant="body1">{feature}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </CardContent>

                                <Box sx={{ p: 2 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        onClick={() => handleBuyPackage(pkg._id)}
                                        disabled={!pkg.isActive || loading}
                                        sx={{
                                            py: 1.5,
                                            fontWeight: 'bold',
                                            fontSize: '1rem',
                                            backgroundColor: pkg.popular ? '#ff9800' : '',
                                            '&:hover': {
                                                backgroundColor: pkg.popular ? '#fb8c00' : ''
                                            }
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Chọn Gói Này'}
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default PostPackagePage;