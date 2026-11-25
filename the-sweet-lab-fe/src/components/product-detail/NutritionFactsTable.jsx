function NutritionFactsTable({ nutritionFacts }) {
  if (!nutritionFacts) return null;

  const stats = [
    { label: 'Năng lượng', value: `${nutritionFacts.calories} kcal` },
    { label: 'Chất đạm (Protein)', value: `${nutritionFacts.proteinG} g` },
    { label: 'Tinh bột (Carb)', value: `${nutritionFacts.carbG} g` },
    { label: 'Đường (Sugar)', value: `${nutritionFacts.sugarG} g` },
    { label: 'Chất xơ (Fiber)', value: `${nutritionFacts.fiberG} g` },
    { label: 'Chất béo (Fat)', value: `${nutritionFacts.fatG} g` },
    { label: 'Natri (Sodium)', value: `${nutritionFacts.sodiumMg} mg` },
    { label: 'Khẩu phần chuẩn', value: `${nutritionFacts.perAmountG} g` },
  ];

  return (
    <section className="nutrition-card">
      <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
        Bảng Giá Trị Dinh Dưỡng (trên {nutritionFacts.perAmountG}g)
      </h2>
      <div className="nutrition-grid">
        {stats.map((item) => (
          <div key={item.label} className="nutrition-stat">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default NutritionFactsTable;
