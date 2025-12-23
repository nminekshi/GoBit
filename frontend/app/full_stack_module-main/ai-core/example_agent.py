# example_agent.py
import os
from agno import Agent, Model

def main():
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise SystemExit("Set OPENAI_API_KEY environment variable before running.")

    # choose provider/model according to your account (OpenAI example)
    model = Model.openai("gpt-4o-mini")  # change to a model name you have access to

    agent = Agent(
        name="hello-agent",
        model=model,
        instructions="You are a helpful assistant. Answer concisely."
    )

    resp = agent.run("Give a 3-step plan to learn Python for a total beginner.")
    print("Agent response:\n", resp)

if __name__ == "__main__":
    main()
