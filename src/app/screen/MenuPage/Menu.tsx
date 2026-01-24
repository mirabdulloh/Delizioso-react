import React, { useState } from "react";
import "../../../css/menu.css";

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("All Category");

  const categories = ["All Category", "Dinner", "Lunch", "Dessert", "Drink"];

  const menuItems = [
    {
      id: 1,
      name: "Spaghetti",
      image: "/images/spaghetti.jpg",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas consequat mi eget auctor aliquam, diam.",
      price: 12.05,
      category: "Lunch",
    },
    {
      id: 2,
      name: "Gnocchi",
      image: "/images/gnocchi.jpg",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas consequat mi eget auctor aliquam, diam.",
      price: 12.05,
      category: "Dinner",
    },
    {
      id: 3,
      name: "Ravioli",
      image: "/images/ravioli.jpg",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas consequat mi eget auctor aliquam, diam.",
      price: 12.05,
      category: "Lunch",
    },
    {
      id: 4,
      name: "Penne Alla Vodak",
      image: "/images/penne.jpg",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas consequat mi eget auctor aliquam, diam.",
      price: 12.05,
      category: "Dinner",
    },
    {
      id: 5,
      name: "Risoto",
      image: "/images/risoto.jpg",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas consequat mi eget auctor aliquam, diam.",
      price: 12.05,
      category: "Lunch",
    },
    {
      id: 6,
      name: "Splitza Signature",
      image: "/images/pizza.jpg",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas consequat mi eget auctor aliquam, diam.",
      price: 12.05,
      category: "Dinner",
    },
  ];

  const filteredItems =
    activeCategory === "All Category"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);


  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={index < 0 ? "star filled" : "star"}>
        ★
      </span>
    ));
  };

  return (
    <section className="menu-section" id="menu">
      <div className="menu-container">
        <h1 className="menu-title">Menu</h1>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="menu-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="menu-card">
              <div className="menu-card-image">
                <img src={item.image} alt={item.name} />
              </div>
              <h3 className="menu-card-title">{item.name}</h3>
              <div className="menu-card-rating">{renderStars()}</div>
              <p className="menu-card-description">{item.description}</p>
              <div className="menu-card-footer">
                <span className="menu-card-price">
                  ${item.price.toFixed(2)}
                </span>
                <button className="order-btn">Order now</button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button className="page-btn prev">‹</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <span className="page-dots">...</span>
          <button className="page-btn next">›</button>
        </div>
      </div>
    </section>
  );
};

export default Menu;
