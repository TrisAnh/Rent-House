"use client"

import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    Chip,
    Dialog,
    DialogContent,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    MenuItem,
    OutlinedInput,
    Radio,
    RadioGroup,
    Select,
    Slider,
    TextField,
    Typography,
} from "@mui/material"
import { Wifi, AcUnit, DirectionsCar, Elevator, Notifications, Close } from "@mui/icons-material"
import axios from "axios"
import "react-toastify/dist/ReactToastify.css"

const PostAlertSubscriptionForm = ({ open, onClose }) => {
    const [formData, setFormData] = useState({
        priceMin: 0,
        priceMax: 10000000,
        roomType: [],
        sizeMin: 0,
        sizeMax: 100,
        location: {
            city: "",
            district: "",
            ward: "",
        },
        amenities: {
            wifi: false,
            airConditioner: false,
            parking: false,
            elevator: false,
        },
        emailFrequency: "daily",
    })

    const [cities, setCities] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])

    useEffect(() => {
        axios.get("https://provinces.open-api.vn/api/p/").then((res) => setCities(res.data))
    }, [])


    const handleCityChange = (e) => {
        const cityCode = e.target.value
        const cityName = cities.find(city => city.code === cityCode)?.name || ""

        setFormData((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                city: cityName,
                cityCode: cityCode,
                district: "",
                ward: "",
            },
        }))
        setWards([])
        axios.get(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`).then((res) => {
            setDistricts(res.data.districts || [])
        })
    }

    const handleDistrictChange = (e) => {
        const districtCode = e.target.value
        const districtName = districts.find(district => district.code === districtCode)?.name || ""

        setFormData((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                district: districtName,
                districtCode: districtCode,
                ward: "",
            },
        }))
        axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`).then((res) => {
            setWards(res.data.wards || [])
        })
    }

    const handleWardChange = (e) => {
        const wardCode = e.target.value
        const wardName = wards.find(ward => ward.code === wardCode)?.name || ""

        setFormData((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                ward: wardName,
                wardCode: wardCode,
            },
        }))
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleAmenityChange = (e) => {
        const { name, checked } = e.target
        setFormData({
            ...formData,
            amenities: {
                ...formData.amenities,
                [name]: checked,
            },
        })
    }

    const handlePriceRangeChange = (event, newValue) => {
        setFormData({ ...formData, priceMin: newValue[0], priceMax: newValue[1] })
    }

    const handleSizeRangeChange = (event, newValue) => {
        setFormData({ ...formData, sizeMin: newValue[0], sizeMax: newValue[1] })
    }

    const handleRoomTypeChange = (event) => {
        const {
            target: { value },
        } = event
        setFormData({
            ...formData,
            roomType: typeof value === "string" ? value.split(",") : value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!formData.location.city) {
                toast.error("Vui lòng chọn thành phố");
                return;
            }

            const payload = {
                criteria: {  // Đổi tên từ priceRange, roomTypes, sizeRange thành đúng tên trong schema
                    priceMin: formData.priceMin,
                    priceMax: formData.priceMax,
                    roomType: formData.roomType,
                    sizeMin: formData.sizeMin,
                    sizeMax: formData.sizeMax,
                    location: {
                        city: formData.location.city,
                        district: formData.location.district,
                        ward: formData.location.ward,
                    },
                    amenities: formData.amenities,
                },
                emailFrequency: formData.emailFrequency,
            };

            const response = await axios.post("http://localhost:5000/api/alert/create", payload, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                toast.success("🎉 Đăng ký nhận thông báo thành công!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setFormData({
                    priceMin: 0,
                    priceMax: 10000000,
                    roomType: [],
                    sizeMin: 0,
                    sizeMax: 100,
                    location: {
                        city: "",
                        district: "",
                        ward: "",
                    },
                    amenities: {
                        wifi: false,
                        airConditioner: false,
                        parking: false,
                        elevator: false,
                    },
                    emailFrequency: "daily",
                });
                setTimeout(() => {
                    onClose();
                }, 1000);
            } else {
                toast.error("❌ Có lỗi xảy ra khi đăng ký!");
            }
        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu:", error);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                "Đã có lỗi xảy ra. Vui lòng thử lại sau.";

            toast.error(`❌ ${errorMessage}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const roomTypeOptions = ["Single", "Double", "Shared", "Apartment", "Dormitory"]

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth
                scroll="paper"
            >
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    style={{ zIndex: 9999 }}
                />
                <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </Box>

                <DialogContent>
                    <Card elevation={0} sx={{ border: 'none', boxShadow: 'none' }}>
                        <CardHeader
                            title="Đăng ký nhận thông báo"
                            subheader="Nhận thông báo khi có phòng trọ phù hợp với tiêu chí của bạn"
                            avatar={<Notifications color="primary" />}
                            sx={{
                                bgcolor: "primary.main",
                                color: "white",
                                "& .MuiCardHeader-subheader": {
                                    color: "rgba(255, 255, 255, 0.8)",
                                },
                                pt: 4
                            }}
                        />
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    {/* Khoảng giá */}
                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>
                                            Khoảng giá
                                        </Typography>
                                        <Box sx={{ px: 2, py: 1 }}>
                                            <Slider
                                                value={[formData.priceMin, formData.priceMax]}
                                                onChange={handlePriceRangeChange}
                                                valueLabelDisplay="auto"
                                                min={0}
                                                max={20000000}
                                                step={500000}
                                            />
                                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                                                <Box sx={{ width: "48%" }}>
                                                    <Typography variant="body2" gutterBottom>
                                                        Giá tối thiểu (VNĐ)
                                                    </Typography>
                                                    <TextField
                                                        value={formData.priceMin}
                                                        onChange={(e) => setFormData({ ...formData, priceMin: Number(e.target.value) })}
                                                        type="number"
                                                        fullWidth
                                                        size="small"
                                                        placeholder="Nhập giá tối thiểu"
                                                    />
                                                </Box>
                                                <Box sx={{ width: "48%" }}>
                                                    <Typography variant="body2" gutterBottom>
                                                        Giá tối đa (VNĐ)
                                                    </Typography>
                                                    <TextField
                                                        value={formData.priceMax}
                                                        onChange={(e) => setFormData({ ...formData, priceMax: Number(e.target.value) })}
                                                        type="number"
                                                        fullWidth
                                                        size="small"
                                                        placeholder="Nhập giá tối đa"
                                                    />
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    {/* Loại phòng */}
                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>
                                            Loại phòng
                                        </Typography>
                                        <FormControl fullWidth>
                                            <Select
                                                multiple
                                                value={formData.roomType}
                                                onChange={handleRoomTypeChange}
                                                input={<OutlinedInput />}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={value} />
                                                        ))}
                                                    </Box>
                                                )}
                                            >
                                                {roomTypeOptions.map((type) => (
                                                    <MenuItem key={type} value={type}>
                                                        {type === "Single" && "Phòng đơn"}
                                                        {type === "Double" && "Phòng đôi"}
                                                        {type === "Shared" && "Phòng ở ghép"}
                                                        {type === "Apartment" && "Căn hộ"}
                                                        {type === "Dormitory" && "Ký túc xá"}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Khoảng diện tích */}
                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>
                                            Diện tích (m²)
                                        </Typography>
                                        <Box sx={{ px: 2, py: 1 }}>
                                            <Slider
                                                value={[formData.sizeMin, formData.sizeMax]}
                                                onChange={handleSizeRangeChange}
                                                valueLabelDisplay="auto"
                                                min={0}
                                                max={200}
                                                step={5}
                                            />
                                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                                                <Box sx={{ width: "48%" }}>
                                                    <Typography variant="body2" gutterBottom>
                                                        Diện tích tối thiểu (m²)
                                                    </Typography>
                                                    <TextField
                                                        value={formData.sizeMin}
                                                        onChange={(e) => setFormData({ ...formData, sizeMin: Number(e.target.value) })}
                                                        type="number"
                                                        fullWidth
                                                        size="small"
                                                        placeholder="Nhập diện tích tối thiểu"
                                                    />
                                                </Box>
                                                <Box sx={{ width: "48%" }}>
                                                    <Typography variant="body2" gutterBottom>
                                                        Diện tích tối đa (m²)
                                                    </Typography>
                                                    <TextField
                                                        value={formData.sizeMax}
                                                        onChange={(e) => setFormData({ ...formData, sizeMax: Number(e.target.value) })}
                                                        type="number"
                                                        fullWidth
                                                        size="small"
                                                        placeholder="Nhập diện tích tối đa"
                                                    />
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    {/* Vị trí */}
                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>
                                            Vị trí
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {/* Thành phố */}
                                            <Grid item xs={12} sm={4}>
                                                <FormControl fullWidth>
                                                    <Select
                                                        value={formData.location.cityCode || ""} // Dùng cityCode để select
                                                        onChange={handleCityChange}
                                                        displayEmpty
                                                    >
                                                        <MenuItem value="">Chọn tỉnh/thành</MenuItem>
                                                        {cities.map((city) => (
                                                            <MenuItem key={city.code} value={city.code}>
                                                                {city.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            {/* Quận/Huyện */}
                                            <Grid item xs={12} sm={4}>
                                                <FormControl fullWidth>
                                                    <Select
                                                        value={formData.location.districtCode || ""} // Dùng districtCode
                                                        onChange={handleDistrictChange}
                                                        displayEmpty
                                                        disabled={!formData.location.cityCode}
                                                    >
                                                        <MenuItem value="">Chọn quận/huyện</MenuItem>
                                                        {districts.map((d) => (
                                                            <MenuItem key={d.code} value={d.code}>
                                                                {d.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            {/* Phường/Xã */}
                                            <Grid item xs={12} sm={4}>
                                                <FormControl fullWidth>
                                                    <Select
                                                        value={formData.location.wardCode || ""} // Dùng wardCode
                                                        onChange={handleWardChange}
                                                        displayEmpty
                                                        disabled={!formData.location.districtCode}
                                                    >
                                                        <MenuItem value="">Chọn phường/xã</MenuItem>
                                                        {wards.map((w) => (
                                                            <MenuItem key={w.code} value={w.code}>
                                                                {w.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>
                                            Tiện ích
                                        </Typography>
                                        <FormGroup>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6} sm={3}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={formData.amenities.wifi}
                                                                onChange={handleAmenityChange}
                                                                name="wifi"
                                                                icon={<Wifi />}
                                                                checkedIcon={<Wifi />}
                                                            />
                                                        }
                                                        label="WiFi"
                                                    />
                                                </Grid>
                                                <Grid item xs={6} sm={3}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={formData.amenities.airConditioner}
                                                                onChange={handleAmenityChange}
                                                                name="airConditioner"
                                                                icon={<AcUnit />}
                                                                checkedIcon={<AcUnit />}
                                                            />
                                                        }
                                                        label="Điều hòa"
                                                    />
                                                </Grid>
                                                <Grid item xs={6} sm={3}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={formData.amenities.parking}
                                                                onChange={handleAmenityChange}
                                                                name="parking"
                                                                icon={<DirectionsCar />}
                                                                checkedIcon={<DirectionsCar />}
                                                            />
                                                        }
                                                        label="Bãi đỗ xe"
                                                    />
                                                </Grid>
                                                <Grid item xs={6} sm={3}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={formData.amenities.elevator}
                                                                onChange={handleAmenityChange}
                                                                name="elevator"
                                                                icon={<Elevator />}
                                                                checkedIcon={<Elevator />}
                                                            />
                                                        }
                                                        label="Thang máy"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </FormGroup>
                                    </Grid>

                                    {/* Tần suất nhận email */}
                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>
                                            Tần suất nhận thông báo
                                        </Typography>
                                        <FormControl component="fieldset">
                                            <RadioGroup name="emailFrequency" value={formData.emailFrequency} onChange={handleChange} row>
                                                <FormControlLabel value="daily" control={<Radio />} label="Hàng ngày" />
                                                <FormControlLabel value="weekly" control={<Radio />} label="Hàng tuần" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>

                                    {/* Nút gửi */}
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                                            <Button type="submit" variant="contained" size="large" startIcon={<Notifications />} sx={{ px: 4 }}>
                                                Đăng ký nhận thông báo
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default PostAlertSubscriptionForm