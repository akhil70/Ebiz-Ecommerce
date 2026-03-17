import React, { useState, useEffect } from "react";
import { X, Upload, Trash2, Plus } from "lucide-react";
import "../AdminForm.css"; // Import the common CSS
import API from "../../Utils/AxiosConfig";
import toast from 'react-hot-toast';

const AddProduct = ({ isOpen, onClose, onSave, productId }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        brandId: "",
        categoryId: "",
        subcategoryId: "",
        stock: "",
        sku: "",
        thumbnail: null,
        images: [],
        isFeatured: false,
        isNewArrival: false,
        status: 1,
        sizeStocks: [],
    });

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    // Fetch dependencies for dropdowns
    useEffect(() => {
        const fetchDependencies = async () => {
            try {
                const [brandsResp, categoriesResp, subcategoriesResp] = await Promise.all([
                    API.get('/brands'),
                    API.get('/categories'),
                    API.get('/subcategories')
                ]);
                setBrands(brandsResp.data);
                setCategories(categoriesResp.data);
                setSubcategories(subcategoriesResp.data);
            } catch (error) {
                console.error("Error fetching dependencies for product dropdowns:", error);
            }
        };
        if (isOpen) {
            fetchDependencies();
        }
    }, [isOpen]);

    // Reset form or fetch details when opened
    useEffect(() => {
        if (isOpen && productId) {
            const fetchProductDetails = async () => {
                const loadingToast = toast.loading('Fetching product details...');
                try {
                    const response = await API.get(`/products/${productId}`);
                    const data = response.data;
                    setFormData({
                        name: data.name || "",
                        description: data.description || "",
                        price: data.price || "",
                        discountPrice: data.discountPrice || "",
                        brandId: data.brandId || "",
                        categoryId: data.categoryId || "",
                        subcategoryId: data.subcategoryId || "",
                        stock: data.stock || "",
                        sku: data.sku || "",
                        thumbnail: data.thumbnail || null,
                        images: data.images || [],
                        isFeatured: data.isFeatured || false,
                        isNewArrival: data.isNewArrival || false,
                        status: data.status ?? 1,
                        sizeStocks: (data.sizeStocks || []).map(s => ({
                            sizeType: s.sizeType || "",
                            size: s.size || "",
                            stock: s.stock ?? ""
                        })),
                    });
                    toast.dismiss(loadingToast);
                } catch (error) {
                    console.error("Error fetching product details:", error);
                    toast.error("Failed to load details", { id: loadingToast });
                }
            };
            fetchProductDetails();
        } else if (isOpen) {
            setFormData({
                name: "",
                description: "",
                price: "",
                discountPrice: "",
                brandId: "",
                categoryId: "",
                subcategoryId: "",
                stock: "",
                sku: "",
                thumbnail: null,
                images: [],
                isFeatured: false,
                isNewArrival: false,
                status: 1,
                sizeStocks: [],
            });
        }
    }, [isOpen, productId]);

    const handleChange = (e) => {
        const { name, type, checked, value, files } = e.target;
        if (type === 'file') {
            if (name === 'thumbnail') {
                setFormData({ ...formData, thumbnail: files[0] });
            } else if (name === 'images') {
                setFormData({ ...formData, images: [...formData.images, ...Array.from(files)] });
            }
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value,
            });
        }
    };

    const removeImage = (index) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
    };

    const addSizeStock = () => {
        setFormData({
            ...formData,
            sizeStocks: [...formData.sizeStocks, { sizeType: "", size: "", stock: "" }]
        });
    };

    const removeSizeStock = (index) => {
        const newSizeStocks = formData.sizeStocks.filter((_, i) => i !== index);
        setFormData({ ...formData, sizeStocks: newSizeStocks });
    };

    const updateSizeStock = (index, field, value) => {
        const newSizeStocks = [...formData.sizeStocks];
        newSizeStocks[index] = { ...newSizeStocks[index], [field]: field === 'stock' ? Number(value) || 0 : value };
        setFormData({ ...formData, sizeStocks: newSizeStocks });
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const actionText = productId ? 'Updating' : 'Creating';
        const loadingToast = toast.loading(`${actionText} product...`);

        try {
            // Process Thumbnail
            let thumbnailBase64 = typeof formData.thumbnail === 'string' ? formData.thumbnail : "";
            if (formData.thumbnail && formData.thumbnail instanceof File) {
                thumbnailBase64 = await convertToBase64(formData.thumbnail);
            }

            // Process Images Array
            const imagesBase64 = [];
            for (const img of formData.images) {
                if (typeof img === 'string') {
                    imagesBase64.push(img);
                } else if (img instanceof File) {
                    const b64 = await convertToBase64(img);
                    imagesBase64.push(b64);
                }
            }

            const payload = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                discountPrice: Number(formData.discountPrice),
                brandId: formData.brandId,
                categoryId: formData.categoryId,
                subcategoryId: formData.subcategoryId,
                stock: Number(formData.stock),
                sku: formData.sku,
                thumbnail: thumbnailBase64,
                images: imagesBase64,
                isFeatured: formData.isFeatured,
                isNewArrival: formData.isNewArrival,
                status: Number(formData.status),
                sizeStocks: formData.sizeStocks.map(s => ({
                    sizeType: s.sizeType || "",
                    size: s.size || "",
                    stock: Number(s.stock) || ""
                }))
            };

            let response;
            if (productId) {
                response = await API.put(`/products/${productId}`, payload);
            } else {
                response = await API.post('/products', payload);
            }

            toast.success(`Product ${productId ? 'updated' : 'created'} successfully!`, { id: loadingToast });
            if (onSave) onSave(response.data);
            onClose();
        } catch (error) {
            console.error(`Error ${productId ? 'updating' : 'creating'} product:`, error);
            toast.error(error.response?.data?.message || `Failed to ${productId ? 'update' : 'create'} product`, { id: loadingToast });
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="sidebar-overlay" onClick={onClose}></div>
            <div className="sidebar-container" style={{ width: '560px' }}>
                <div className="sidebar-header">
                    <h2 className="sidebar-title">{productId ? 'Update Product' : 'New Product'}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="sidebar-content">
                    <form id="add-product-form" onSubmit={handleSubmit} className="admin-form">

                        <div className="form-group">
                            <label className="form-label">Product Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" placeholder="Enter Product Name" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="form-group">
                                <label className="form-label">Price *</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="form-input" placeholder="0.00" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Discount Price</label>
                                <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="form-input" placeholder="0.00" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Brand *</label>
                            <select name="brandId" value={formData.brandId} onChange={handleChange} required className="form-input">
                                <option value="">Select Brand</option>
                                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="form-group">
                                <label className="form-label">Category *</label>
                                <select name="categoryId" value={formData.categoryId} onChange={handleChange} required className="form-input">
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Subcategory *</label>
                                <select name="subcategoryId" value={formData.subcategoryId} onChange={handleChange} required className="form-input">
                                    <option value="">Select Subcategory</option>
                                    {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="form-group">
                                <label className="form-label">Stock *</label>
                                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="form-input" placeholder="0" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">SKU</label>
                                <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="form-input" placeholder="SKU-XXXX" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Size & Stock</label>
                            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px' }}>Add size variants with individual stock levels</p>
                            {formData.sizeStocks.map((item, index) => (
                                <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', marginBottom: '10px' }}>
                                    <input
                                        type="text"
                                        placeholder="Size Type (e.g. Clothing)"
                                        value={item.sizeType}
                                        onChange={(e) => updateSizeStock(index, 'sizeType', e.target.value)}
                                        className="form-input"
                                        style={{ flex: 1, marginBottom: 0 }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Size (e.g. S, M, L)"
                                        value={item.size}
                                        onChange={(e) => updateSizeStock(index, 'size', e.target.value)}
                                        className="form-input"
                                        style={{ flex: 1, marginBottom: 0 }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Stock"
                                        value={item.stock}
                                        onChange={(e) => updateSizeStock(index, 'stock', e.target.value)}
                                        className="form-input"
                                        style={{ width: '80px', marginBottom: 0 }}
                                        min="0"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSizeStock(index)}
                                        style={{
                                            background: '#ef4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            flexShrink: 0
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addSizeStock}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: '#4f46e5',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '8px 14px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <Plus size={16} /> Add Size Variant
                            </button>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Thumbnail *</label>
                            <input type="file" name="thumbnail" onChange={handleChange} className="form-input" accept="image/*" />
                            {formData.thumbnail && (
                                <div style={{ marginTop: '5px' }}>
                                    <img
                                        src={typeof formData.thumbnail === 'string' ? formData.thumbnail : URL.createObjectURL(formData.thumbnail)}
                                        alt="Thumbnail Preview"
                                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Gallery Images</label>
                            <input type="file" name="images" onChange={handleChange} multiple className="form-input" accept="image/*" />
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '5px' }}>
                                {formData.images.map((img, idx) => (
                                    <div key={idx} style={{ position: 'relative' }}>
                                        <img
                                            src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                                            alt="Gallery"
                                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '10px' }}
                                        >
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="form-textarea" placeholder="Product details..."></textarea>
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <label className="checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} /> Featured
                            </label>
                            <label className="checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} /> New Arrival
                            </label>
                            <label className="checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                <input type="checkbox" name="status" checked={formData.status === 1} onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 1 : 0 })} /> Active
                            </label>
                        </div>
                    </form>
                </div>

                <div className="sidebar-footer">
                    <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button type="submit" form="add-product-form" className="btn-submit">{productId ? 'Update Product' : 'Save Product'}</button>
                </div>
            </div>
        </>
    );
};

export default AddProduct;
