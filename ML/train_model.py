import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import pickle

# Carga el CSV
df = pd.read_csv('users.csv')

# Crea una columna de dificultad para ejemplo (ajusta según tu criterio)
# Aquí se asigna dificultad según el puntaje máximo
df['dificultad'] = pd.cut(df['max_score'], bins=[-1, 600, 1000, 2000], labels=['easy', 'medium', 'hard'])

# Selecciona las columnas relevantes
X = df[['age', 'games_won', 'best_time', 'games_loss', 'max_score']]
y = df['dificultad']

# Entrena el modelo
model = DecisionTreeClassifier()
model.fit(X, y)

# Guarda el modelo entrenado
with open('tron_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("Modelo entrenado y guardado como tron_model.pkl")