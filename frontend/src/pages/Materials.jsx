import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, X } from 'lucide-react';
import ScrollReveal from '../components/ui/ScrollReveal';
import { apiFetch } from '../services/api';
import SkeletonGrid from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

const categories = [
  { id: 'all', name: 'All Materials' },
  { id: 'flooring', name: 'Flooring' },
  { id: 'marble', name: 'Marble & Stone' },
  { id: 'tiles', name: 'Tiles' },
  { id: 'fixtures', name: 'Fixtures' },
];

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') setSelectedMaterial(null);
  }, []);

  useEffect(() => {
    if (selectedMaterial) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [selectedMaterial, handleEscape]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const params = activeCategory === 'all' ? '' : `?category=${activeCategory}`;
        const res = await apiFetch(`/materials${params}`);
        if (res.success) {
          setMaterials(res.data);
        }
      } catch (e) {
        console.error('Error fetching materials:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [activeCategory]);

  const filteredMaterials = activeCategory === 'all' 
    ? materials 
    : materials.filter(m => m.category === activeCategory);

  const getSpecValue = (specs, key) => {
    if (!specs) return '';
    if (typeof specs === 'object' && key in specs) return specs[key] || '';
    return '';
  };

  return (
    <div className="page-content page-offset">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-[#1A1817] to-[#2D2A28] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">
              Experience Center
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mt-2">
              Material Catalog
            </h1>
            <p className="text-stone-400 mt-4 max-w-2xl">
              Explore our premium collection of flooring, marble, tiles, and fixtures. 
              Quality materials sourced from trusted suppliers for your interior projects.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-4 sm:py-6 bg-white border-b border-stone-200 sticky z-10" style={{ top: 'var(--nav-height, 5rem)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-2 rounded-full text-xs font-bold uppercase transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#C4795A] text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="py-12 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <SkeletonGrid count={8} cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" gap="gap-4 sm:gap-6" />
          ) : filteredMaterials.length === 0 ? (
            <EmptyState
              icon="search"
              title="No materials found"
              description="No materials available in this category. Try selecting a different category or check back later."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredMaterials.map((material, index) => (
                <ScrollReveal key={material._id} delay={index * 50}>
                  <div
                    onClick={() => setSelectedMaterial(material)}
                    className="bg-white rounded-2xl overflow-hidden border border-stone-200 cursor-pointer hover-lift group"
                  >
                    {/* Image */}
                    <div className="aspect-square bg-stone-100 relative overflow-hidden">
                      {material.images && material.images.length > 0 ? (
                        <img
                          src={material.images[0]}
                          alt={material.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                          <span className="text-stone-500 text-sm">No Image</span>
                        </div>
                      )}
                      {material.isFeatured && (
                        <div className="absolute top-3 left-3 px-2 py-1 bg-[#C4795A] text-white text-xs font-bold rounded-full">
                          Featured
                        </div>
                      )}
                      {!material.inStock && (
                        <div className="absolute top-3 right-3 px-2 py-1 bg-stone-800 text-white text-xs font-bold rounded-full">
                          Out of Stock
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="text-[10px] text-[#C4795A] font-bold uppercase tracking-wider mb-1">
                        {material.category}
                      </div>
                      <h3 className="font-serif font-bold text-stone-900 text-sm mb-1 line-clamp-1">
                        {material.name}
                      </h3>
                      {material.subcategory && (
                        <div className="text-xs text-stone-500 mb-2">{material.subcategory}</div>
                      )}
                      
                      {/* Key specs preview */}
                      <div className="flex gap-2 text-xs text-stone-600">
                        {getSpecValue(material.specifications, 'origin') && (
                          <span className="truncate">{getSpecValue(material.specifications, 'origin')}</span>
                        )}
                        {getSpecValue(material.specifications, 'finish') && (
                          <span>• {getSpecValue(material.specifications, 'finish')}</span>
                        )}
                      </div>

                      {/* Price */}
                      {material.pricePerUnit > 0 && (
                        <div className="mt-3 pt-3 border-t border-stone-100">
                          <div className="font-bold text-[#C4795A] text-sm">
                            {material.pricePerUnit.toLocaleString()} {material.currency || 'AED'}/{material.unit}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Material Detail Modal */}
      {selectedMaterial && (
        <div className="modal-overlay" onClick={() => setSelectedMaterial(null)}>
          <div className="modal-panel max-w-4xl max-h-[92dvh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div>
              <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-4 mb-6">
                <div className="min-w-0">
                  <span className="text-[#C4795A] font-bold text-xs uppercase tracking-wider">
                    {selectedMaterial.category}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                    {selectedMaterial.name}
                  </h2>
                  {selectedMaterial.subcategory && (
                    <div className="text-stone-500 text-sm">{selectedMaterial.subcategory}</div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedMaterial(null)}
                  className="p-2 hover:bg-stone-100 rounded-full transition"
                  aria-label="Close material details"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Image Gallery */}
              {selectedMaterial.images && selectedMaterial.images.length > 0 && (
                <div className="mb-6">
                  <img
                    src={selectedMaterial.images[0]}
                    alt={selectedMaterial.name}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                </div>
              )}

              {/* Description */}
              {selectedMaterial.description && (
                <div className="mb-6">
                  <h3 className="font-bold text-stone-900 mb-2">Description</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {selectedMaterial.description}
                  </p>
                </div>
              )}

              {/* Specifications */}
              {selectedMaterial.specifications && Object.keys(selectedMaterial.specifications).length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-stone-900 mb-3">Specifications</h3>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                    {Object.entries(selectedMaterial.specifications).map(([key, value]) => (
                      <div key={key} className="bg-stone-50 p-3 rounded-lg">
                        <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">
                          {key}
                        </div>
                        <div className="font-semibold text-stone-900 text-sm">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price and Stock */}
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 pt-4 border-t border-stone-200">
                <div>
                  {selectedMaterial.pricePerUnit > 0 && (
                    <div className="font-bold text-[#C4795A] text-lg">
                      {selectedMaterial.pricePerUnit.toLocaleString()} {selectedMaterial.currency || 'AED'}/{selectedMaterial.unit}
                    </div>
                  )}
                  <div className={`text-sm font-medium ${selectedMaterial.inStock ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {selectedMaterial.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                  </div>
                </div>
                <Link
                  to={`/consultation?material=${encodeURIComponent(selectedMaterial.name || selectedMaterial.slug || '')}`}
                  onClick={() => setSelectedMaterial(null)}
                  className="btn-terracotta px-6 py-3 rounded-xl font-semibold"
                >
                  Get Quote for This Material
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
