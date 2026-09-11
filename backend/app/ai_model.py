from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor


# ============================================================
# MODEL FILE
# ============================================================

MODEL_PATH = (
    Path(__file__).resolve().parent
    / "waiting_time_model.joblib"
)


# ============================================================
# BUILD TRAINING DATA
# ============================================================

def build_training_data(training_records):
    """
    Convert completed queue records into ML training data.

    Required:
        created_at
        started_at
        completed_at
        people_ahead
    """

    data = []

    for record in training_records:

        created_at = record.get("created_at")
        started_at = record.get("started_at")
        completed_at = record.get("completed_at")

        people_ahead = record.get("people_ahead", 0)

        # Skip incomplete records
        if not created_at:
            continue

        if not started_at:
            continue

        if not completed_at:
            continue

        # ----------------------------------------------------
        # Calculate waiting time
        # ----------------------------------------------------

        waiting_minutes = (
            started_at - created_at
        ).total_seconds() / 60

        # ----------------------------------------------------
        # Calculate consultation time
        # ----------------------------------------------------

        consultation_minutes = (
            completed_at - started_at
        ).total_seconds() / 60

        # ----------------------------------------------------
        # Validate values
        # ----------------------------------------------------

        if waiting_minutes < 0:
            continue

        if consultation_minutes <= 0:
            continue

        # Ignore obviously broken waiting records
        if waiting_minutes > 240:
            continue

        data.append({
            "people_ahead": people_ahead,
            "hour": created_at.hour,
            "day_of_week": created_at.weekday(),
            "consultation_minutes": consultation_minutes,
            "waiting_minutes": waiting_minutes,
        })

    return pd.DataFrame(data)


# ============================================================
# TRAIN MODEL
# ============================================================

def train_model(training_records):
    """
    Train a Random Forest model using completed queue records.
    """

    df = build_training_data(training_records)

    print("\n===== AI TRAINING DATA =====")

    if not df.empty:
        for _, row in df.iterrows():
            print(
                f"people_ahead: {row['people_ahead']} | "
                f"consultation: {row['consultation_minutes']:.2f} | "
                f"waiting: {row['waiting_minutes']:.2f}"
            )

    print("============================\n")

    # Need at least 2 valid records
    if len(df) < 2:
        raise ValueError(
            "Not enough valid training data. "
            "At least 2 completed queue records "
            "with valid timestamps are required."
        )

    # --------------------------------------------------------
    # Features
    # --------------------------------------------------------

    features = [
        "people_ahead",
        "hour",
        "day_of_week",
        "consultation_minutes",
    ]

    X = df[features]
    y = df["waiting_minutes"]

    # --------------------------------------------------------
    # Random Forest
    # --------------------------------------------------------

    model = RandomForestRegressor(
        n_estimators=100,
        random_state=42,
        max_depth=5
    )

    model.fit(X, y)

    # --------------------------------------------------------
    # Save model
    # --------------------------------------------------------

    joblib.dump(
        {
            "model": model,
            "features": features,
        },
        MODEL_PATH
    )

    return {
        "model": model,
        "features": features,
        "training_records": len(df),
    }


# ============================================================
# LOAD MODEL
# ============================================================

def load_model():
    """
    Load the trained waiting-time model.
    """

    if not MODEL_PATH.exists():
        return None

    saved_model = joblib.load(MODEL_PATH)

    return saved_model


# ============================================================
# PREDICT WAITING TIME
# ============================================================

def predict_waiting_time(
    people_ahead,
    hour,
    day_of_week,
    consultation_minutes,
):
    """
    Predict waiting time in minutes.
    """

    saved_model = load_model()

    if saved_model is None:
        return None

    model = saved_model["model"]
    features = saved_model["features"]

    input_data = pd.DataFrame([
        {
            "people_ahead": people_ahead,
            "hour": hour,
            "day_of_week": day_of_week,
            "consultation_minutes": consultation_minutes,
        }
    ])

    prediction = model.predict(
        input_data[features]
    )[0]

    # Never return negative waiting time
    prediction = max(0, prediction)

    return round(float(prediction), 2)