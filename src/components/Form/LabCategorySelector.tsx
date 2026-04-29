import { useFormStore } from '../../store/formStore';
import { CATEGORY_INFO } from '../../data/labItems';
import type { LabCategoryName } from '../../types';

const categories: LabCategoryName[] = ['Basix', 'Standard', 'Advanced', 'Premium'];

export default function LabCategorySelector() {
  const { selectedCategory, setCategory } = useFormStore();

  return (
    <>
      <div className="section-label">Lab Category</div>
      <div className="category-cards">
        {categories.map((cat) => (
          <label className="category-card" key={cat}>
            <input
              type="radio"
              name="labCategory"
              value={cat}
              checked={selectedCategory === cat}
              onChange={() => setCategory(cat)}
            />
            <div className="card-body">
              <span className="cat-icon">{CATEGORY_INFO[cat].icon}</span>
              <span className="cat-name">{cat}</span>
              <span className="cat-desc">{CATEGORY_INFO[cat].desc}</span>
              <div className="cat-check"></div>
            </div>
          </label>
        ))}
      </div>
    </>
  );
}
