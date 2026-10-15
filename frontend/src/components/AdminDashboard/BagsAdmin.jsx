import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Image as ImageIcon, X, Tag } from 'lucide-react';
import imageCompression from 'browser-image-compression';

const MAX_IMAGES = 6;

const makeEmptyBag = () => ({
  name: { ar: '', en: '' },
  price: '',
  discountPrice: '',
  stock: '',
  description: { ar: '', en: '' },
  images: [],
  colors: [{ name: { ar: '', en: '' }, image: '' }],
  is_sale: false
});

export default function BagsAdmin({ lang = 'ar', supabaseClient, showSuccess, setConfirmModal }) {
  const isAr = lang === 'ar';

  const [bags, setBags] = useState([]);
  const [newBag, setNewBag] = useState(makeEmptyBag());
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBags();
  }, [supabaseClient]);

  const pick = (field) => {
    if (!field) return '';
    if (typeof field === 'object') return field[lang] || field.ar || field.en || '';
    return field;
  };

  const fetchBags = async () => {
    if (!supabaseClient) return;
    try {
      const { data, error } = await supabaseClient
        .from('bags')
        .select('*')
        .order('id', { ascending: false });
      if (error) throw error;
      if (data) setBags(data);
    } catch (err) {
      console.error('Error fetching bags:', err.message);
    }
  };

  // رفع صورة واحدة بعد ضغطها وإرجاع رابطها
  const uploadOne = async (file) => {
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 800,
      useWebWorker: true,
      fileType: 'image/webp'
    });
    const filePath = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.webp`;

    const { error: uploadError } = await supabaseClient.storage
      .from('product-images')
      .upload(filePath, compressed);
    if (uploadError) throw uploadError;

    const { data } = supabaseClient.storage.from('product-images').getPublicUrl(filePath);
    return data?.publicUrl || '';
  };

  // ----- صور الحقيبة العامة (حتى 6) -----
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = '';
    if (!supabaseClient || files.length === 0) return;

    setLoading(true);
    try {
      const urls = [];
      for (const file of files) {
        const url = await uploadOne(file);
        if (url) urls.push(url);
      }
      setNewBag((prev) => ({
        ...prev,
        images: [...prev.images, ...urls].slice(0, MAX_IMAGES)
      }));
    } catch (err) {
      console.error('Error uploading bag images:', err.message);
      showSuccess(isAr ? 'فشل رفع الصورة، تحقق من الاتصال' : 'Image upload failed');
    } finally {
      setLoading(false);
    }
  };

  const removeGalleryImage = (index) => {
    setNewBag((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // ----- الألوان -----
  const updateColor = (index, patch) => {
    setNewBag((prev) => ({
      ...prev,
      colors: prev.colors.map((c, i) => (i === index ? { ...c, ...patch } : c))
    }));
  };

  const addColor = () => {
    setNewBag((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: { ar: '', en: '' }, image: '' }]
    }));
  };

  const removeColor = (index) => {
    setNewBag((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const uploadColorImage = async (index, file) => {
    if (!supabaseClient || !file) return;
    setLoading(true);
    try {
      const url = await uploadOne(file);
      if (url) updateColor(index, { image: url });
    } catch (err) {
      console.error('Error uploading color image:', err.message);
      showSuccess(isAr ? 'فشل رفع الصورة، تحقق من الاتصال' : 'Image upload failed');
    } finally {
      setLoading(false);
    }
  };

  // ----- إضافة / تعديل / حذف -----
  const handleCancelEdit = () => {
    setEditingId(null);
    setNewBag(makeEmptyBag());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validColors = newBag.colors.filter((c) => c.name.ar || c.name.en);
    if (validColors.length === 0) {
      showSuccess(isAr ? 'أضف لونًا واحدًا على الأقل مع اسمه' : 'Add at least one color with a name');
      return;
    }

    const mainImage = validColors.find((c) => c.image)?.image || newBag.images[0];
    if (!mainImage) {
      showSuccess(isAr ? 'أضف صورة واحدة على الأقل للحقيبة' : 'Add at least one image');
      return;
    }

    setLoading(true);

    const payload = {
      name: newBag.name,
      description: newBag.description,
      price: parseFloat(newBag.price),
      discount_price: newBag.discountPrice ? parseFloat(newBag.discountPrice) : null,
      stock: parseInt(newBag.stock) || 0,
      image: mainImage,
      images: newBag.images,
      colors: validColors,
      is_sale: newBag.is_sale
    };

    try {
      if (editingId !== null) {
        const { error } = await supabaseClient.from('bags').update(payload).eq('id', editingId);
        if (error) throw error;
        setBags((prev) => prev.map((b) => (b.id === editingId ? { ...b, ...payload } : b)));
        showSuccess(isAr ? 'تم تعديل الحقيبة بنجاح' : 'Bag updated successfully');
      } else {
        const { data, error } = await supabaseClient.from('bags').insert([payload]).select();
        if (error) throw error;
        if (data) setBags((prev) => [data[0], ...prev]);
        showSuccess(isAr ? 'تمت إضافة الحقيبة بنجاح' : 'Bag added successfully');
      }
      handleCancelEdit();
    } catch (err) {
      console.error('Error saving bag:', err.message);
      showSuccess(isAr ? 'حدث خطأ أثناء حفظ الحقيبة' : 'Error saving bag');
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (bag) => {
    setEditingId(bag.id);
    setNewBag({
      name: { ar: bag.name?.ar || '', en: bag.name?.en || '' },
      price: bag.price || '',
      discountPrice: bag.discount_price || '',
      stock: bag.stock || '',
      description: { ar: bag.description?.ar || '', en: bag.description?.en || '' },
      images: Array.isArray(bag.images) ? bag.images : [],
      colors:
        Array.isArray(bag.colors) && bag.colors.length > 0
          ? bag.colors.map((c) => ({
              name: { ar: c.name?.ar || '', en: c.name?.en || '' },
              image: c.image || ''
            }))
          : makeEmptyBag().colors,
      is_sale: bag.is_sale || false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = (id) => {
    setConfirmModal({
      show: true,
      title: isAr ? 'تأكيد حذف الحقيبة' : 'Confirm Bag Deletion',
      message: isAr
        ? 'هل أنت متأكد من حذف هذه الحقيبة نهائياً؟ لا يمكن التراجع عن هذا الإجراء.'
        : 'Are you sure you want to delete this bag permanently? This cannot be undone.',
      onConfirm: async () => {
        setConfirmModal({ show: false, title: '', message: '', onConfirm: null });
        try {
          const { error } = await supabaseClient.from('bags').delete().eq('id', id);
          if (error) throw error;
          setBags((prev) => prev.filter((b) => b.id !== id));
          showSuccess(isAr ? 'تم حذف الحقيبة' : 'Bag deleted');
        } catch (err) {
          console.error('Error deleting bag:', err.message);
          showSuccess(isAr ? 'فشل حذف الحقيبة' : 'Failed to delete bag');
        }
      }
    });
  };

  return (
    <div className="admin-section">
      <h2>{isAr ? `إدارة الحقائب (${bags.length})` : `Manage Bags (${bags.length})`}</h2>

      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-header-row">
          <h3>
            {editingId !== null
              ? isAr ? 'تعديل الحقيبة' : 'Edit Bag'
              : isAr ? 'إضافة حقيبة جديدة' : 'Add New Bag'}
          </h3>
          {editingId !== null && (
            <button type="button" onClick={handleCancelEdit} className="cancel-edit-btn">
              {isAr ? 'إلغاء التعديل' : 'Cancel Edit'}
            </button>
          )}
        </div>

        <div className="form-grid">
          <input
            type="text"
            placeholder={isAr ? 'اسم الحقيبة بالعربية' : 'Bag Name (Arabic)'}
            value={newBag.name.ar}
            onChange={(e) => setNewBag({ ...newBag, name: { ...newBag.name, ar: e.target.value } })}
            required
          />
          <input
            type="text"
            placeholder={isAr ? 'اسم الحقيبة بالإنجليزية' : 'Bag Name (English)'}
            value={newBag.name.en}
            onChange={(e) => setNewBag({ ...newBag, name: { ...newBag.name, en: e.target.value } })}
          />
          <input
            type="number"
            placeholder={isAr ? 'السعر الأصلي (د.ج)' : 'Regular Price (DZD)'}
            value={newBag.price}
            onChange={(e) => setNewBag({ ...newBag, price: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder={isAr ? 'سعر التخفيض (اختياري)' : 'Discount Price (Optional)'}
            value={newBag.discountPrice}
            onChange={(e) => setNewBag({ ...newBag, discountPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder={isAr ? 'الكمية المتبقية في المخزون' : 'Stock Quantity'}
            value={newBag.stock}
            onChange={(e) => setNewBag({ ...newBag, stock: e.target.value })}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255,255,255,0.03)',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <input
            type="checkbox"
            id="bagSaleCheckbox"
            checked={newBag.is_sale}
            onChange={(e) => setNewBag({ ...newBag, is_sale: e.target.checked })}
            style={{ width: '18px', height: '18px', accentColor: '#E11D48', cursor: 'pointer' }}
          />
          <label
            htmlFor="bagSaleCheckbox"
            style={{
              cursor: 'pointer',
              color: '#ffffff',
              fontWeight: '500',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Tag size={16} color="#E11D48" />
            {isAr ? 'تفعيل التخفيض (يظهر سعر التخفيض والنسبة)' : 'Enable discount (shows sale price and %)'}
          </label>
        </div>

        <div className="form-grid textareas-grid">
          <textarea
            placeholder={isAr ? 'وصف الحقيبة بالعربية' : 'Bag Description (Arabic)'}
            value={newBag.description.ar}
            onChange={(e) =>
              setNewBag({ ...newBag, description: { ...newBag.description, ar: e.target.value } })
            }
          />
          <textarea
            placeholder={isAr ? 'وصف الحقيبة بالإنجليزية (اختياري)' : 'Bag Description (English)'}
            value={newBag.description.en}
            onChange={(e) =>
              setNewBag({ ...newBag, description: { ...newBag.description, en: e.target.value } })
            }
          />
        </div>

        {/* صور الحقيبة العامة (حتى 6 صور) */}
        <div className="images-upload-wrapper">
          <label className="upload-label-title">
            {isAr
              ? `صور الحقيبة (${newBag.images.length}/${MAX_IMAGES} مرفوعة):`
              : `Bag Images (${newBag.images.length}/${MAX_IMAGES} uploaded):`}
          </label>

          <div className="upload-controls">
            {newBag.images.length < MAX_IMAGES && (
              <label className="file-upload-btn">
                <ImageIcon size={18} />
                <span>{isAr ? 'اختر صور' : 'Select Images'}</span>
                <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} hidden />
              </label>
            )}
          </div>

          <div className="previews-container">
            {newBag.images.map((imgSrc, idx) => (
              <div key={idx} className="preview-thumb-wrapper">
                <img src={imgSrc} alt={`Preview ${idx + 1}`} className="preview-thumb" />
                <button type="button" onClick={() => removeGalleryImage(idx)} className="remove-thumb-btn">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* الألوان: اسم لكل لون وصورة اختيارية */}
        <div className="images-upload-wrapper">
          <label className="upload-label-title">
            {isAr
              ? 'الألوان المتوفرة (اسم اللون، وصورة اللون اختيارية):'
              : 'Available colors (a name for each, image optional):'}
          </label>

          {newBag.colors.map((color, idx) => (
            <div key={idx} className="form-grid" style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder={isAr ? 'اسم اللون بالعربية (مثال: أسود)' : 'Color name (Arabic)'}
                value={color.name.ar}
                onChange={(e) => updateColor(idx, { name: { ...color.name, ar: e.target.value } })}
              />
              <input
                type="text"
                placeholder={isAr ? 'اسم اللون بالإنجليزية (Black)' : 'Color name (English)'}
                value={color.name.en}
                onChange={(e) => updateColor(idx, { name: { ...color.name, en: e.target.value } })}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label className="file-upload-btn">
                  <ImageIcon size={16} />
                  <span>
                    {color.image
                      ? isAr ? 'تغيير الصورة' : 'Change image'
                      : isAr ? 'صورة اللون' : 'Color image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => uploadColorImage(idx, e.target.files[0])}
                  />
                </label>
                {color.image && (
                  <img
                    src={color.image}
                    alt=""
                    style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }}
                  />
                )}
                {newBag.colors.length > 1 && (
                  <button type="button" className="delete-prod-btn" onClick={() => removeColor(idx)}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}

          <button type="button" className="file-upload-btn" onClick={addColor}>
            <Plus size={16} />
            <span>{isAr ? 'إضافة لون آخر' : 'Add another color'}</span>
          </button>
        </div>

        <button type="submit" className="add-btn" disabled={loading}>
          {editingId !== null ? <Edit3 size={18} /> : <Plus size={18} />}
          <span>
            {loading
              ? isAr ? 'جاري الحفظ...' : 'Saving...'
              : editingId !== null
                ? isAr ? 'حفظ التعديلات' : 'Save Changes'
                : isAr ? 'إضافة الحقيبة' : 'Add Bag'}
          </span>
        </button>
      </form>

      <div className="admin-products-list">
        <h3>{isAr ? 'قائمة الحقائب المحفوظة' : 'Saved Bags'}</h3>
        <div className="admin-prod-grid">
          {bags.map((bag) => (
            <div key={bag.id} className="admin-prod-card">
              <div className="prod-info-left">
                <img src={bag.image} alt="" />
                <div className="prod-text-meta">
                  <h4>{pick(bag.name)}</h4>
                  <div className="prod-sub-meta">
                    <span className="prod-price">
                      {bag.discount_price ? (
                        <>
                          <span className="old-price">{bag.price} DZD</span>
                          <span>{bag.discount_price} DZD</span>
                        </>
                      ) : (
                        <span>{bag.price} DZD</span>
                      )}
                    </span>
                    <span className="prod-stock-badge">
                      {isAr ? `المخزون: ${bag.stock}` : `Stock: ${bag.stock}`}
                    </span>
                    <span className="prod-stock-badge">
                      {isAr
                        ? `${(bag.colors || []).length} ألوان`
                        : `${(bag.colors || []).length} colors`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="prod-actions">
                <button className="edit-prod-btn" onClick={() => handleStartEdit(bag)}>
                  <Edit3 size={16} />
                </button>
                <button className="delete-prod-btn" onClick={() => confirmDelete(bag.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
