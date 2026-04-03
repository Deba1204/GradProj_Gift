import streamlit as st
import pandas as pd
from groq import Groq
import json
import os

# Phase 1: Ingestion
@st.cache_data
def load_data():
    try:
        # Tries the root directory if deployed purely via streamlit logic
        return pd.read_csv('dataset.csv')
    except Exception:
        # Fallback to the modular phase directory
        return pd.read_csv('phase1_data_ingestion/dataset.csv')

dataset = load_data()

# App Configuration
st.set_page_config(page_title="Gift Genius", page_icon="✨", layout="centered")

# Custom CSS for Premium Design mapping
st.markdown("""
<style>
.stApp {
    background-color: #0f172a;
    color: #f8fafc;
}
</style>
""", unsafe_allow_html=True)

# Phase 5: Display & Presentation UI
st.title("✨ Gift Genius")
st.write("Find the perfect gift in seconds with AI.")
st.markdown("---")

# Phase 2: User Input
with st.container():
    st.markdown("### Profile")
    col1, col2 = st.columns(2)
    with col1:
        gift_for = st.text_input("Gift For", placeholder="e.g., Friend, Mother, Partner")
        interests = st.text_input("Interests", placeholder="e.g., Music, Sports, Tech")
    with col2:
        occasion = st.text_input("Occasion", placeholder="e.g., Birthday, Anniversary")
        budget = st.text_input("Budget", placeholder="e.g., Low, 1000-5000 INR, High")

    submit = st.button("Generate Ideas ✨", type="primary", use_container_width=True)

st.markdown("---")

if submit:
    # Phase 2 Validation
    if not gift_for or not interests or not occasion or not budget:
        st.error("Please fill out all fields.")
    else:
        # Phase 3 & 4 Recommendation Generation
        with st.spinner("Consulting the AI for the perfect match..."):
            
            # Secure API Loading (Fetches from st.secrets on Streamlit Cloud, fallback to os.environ)
            api_key = ''
            try:
                api_key = st.secrets["GROQ_API_KEY"]
            except Exception:
                api_key = os.environ.get("GROQ_API_KEY")
                # Backup fallback for local testing with .env if dotenv was loaded
                if not api_key:
                    try:
                        from dotenv import load_dotenv
                        load_dotenv()
                        api_key = os.environ.get("GROQ_API_KEY")
                    except Exception:
                        pass
            
            if not api_key:
                st.error("🔒 GROQ_API_KEY is missing! If you are on Streamlit Cloud, please configure it in your App Settings > Secrets.")
            else:
                try:
                    client = Groq(api_key=api_key)
                    
                    # Mapping the dataset to a lightweight context string
                    context_str = dataset.to_string(index=False)
                    
                    system_prompt = f"""You are an expert gifting assistant. 
You will be provided with a dataset of gift ideas.
Your goal is to recommend 3 personalized gift ideas based on the profile.
Match the user's profile with the closest items in the dataset or extrapolate creatively based on the dataset's themes.
Return the suggestions as a structured JSON array of objects, with exactly two keys: 'giftName' and 'reason'.
Dataset Context:
{context_str}"""

                    user_prompt = f"""User Profile:
- Gift For: {gift_for}
- Interests: {interests}
- Occasion: {occasion}
- Budget: {budget}

Generate exactly valid JSON (an object containing an array called "suggestions" where each element has 'giftName' and 'reason')."""

                    chat_completion = client.chat.completions.create(
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        model="llama-3.1-8b-instant",
                        response_format={"type": "json_object"}
                    )

                    content = chat_completion.choices[0].message.content
                    parsed_json = json.loads(content)
                    
                    ideas = parsed_json.get("suggestions", [])
                    if not ideas and isinstance(parsed_json, list):
                        ideas = parsed_json
                    
                    if ideas:
                        st.markdown("### ✨ Top Suggestions")
                        for idx, item in enumerate(ideas):
                            with st.container(border=True):
                                st.markdown(f"#### {idx + 1}. {item.get('giftName', 'Idea')}")
                                st.markdown(f"*Why?* {item.get('reason', '')}")
                    else:
                        st.warning("The AI could not formulate suggestions in the expected format. Please try again.")
                        
                except Exception as e:
                    st.error(f"Failed to generate ideas via Groq API. Error: {str(e)}")
