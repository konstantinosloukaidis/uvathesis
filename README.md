# 🚆 Dutch Rail Data Visualization (Thesis Project)

This thesis project focuses on collecting, cleaning, and visualizing public train-related datasets in the Netherlands.

The core objectives were:

- Identify and gather open datasets related to Dutch rail operations.
- Clean and preprocess various data formats (Excel, CSV, etc.) using Python and Pandas.
- Define custom metrics and generate JSON outputs which are loaded to a local MongoDB server.
- Visualize insights through an interactive web app built with React and D3.js.

---

## 🎓 Thesis Context

This project was developed as part of a **Master's Thesis**.

It explores the availability of open data in the Dutch railway system, methods for extracting and transforming such data into meaningful metrics, and how those metrics can be visualized to support analysis or decision-making. More in-depth information can be found in my thesis:


---

## ▶️ Run the Visualization App

```bash
cd frontend
npm install
npm start
```

> The app will run at `http://localhost:3000`

Make sure the cleaned JSON files are available in the correct path inside the React app (e.g., `/public/data/` or served from a backend).

---

## 📌 Notes

- Python scripts use `pandas` to clean and process data.
- Visualization is done using D3.js in a React environment.
- Data includes real-world public transport metrics, delays, and schedules (depending on availability).
