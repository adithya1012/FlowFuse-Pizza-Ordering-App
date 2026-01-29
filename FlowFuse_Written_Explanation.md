## Q1: What did you choose to build, and why?

I chose the pizza ordering app because I am comfortable building full-stack applications. I developed the application step by step:

- Login
- Dashboard
- Ordering pizza
- Cart and Orders page
- Containerize applications
- Update README

All features are created with frontend + backend + database. Each time I tested manually and individually before moving to the next feature.

I intentionally left out payment integration. I am aware that within the 2hr 30min timeframe, I would not be able to complete this feature. I had plans of creating a testing suite but could not complete it due to time constraints. 



## Q2: If you used AI as a tool while building this, how and why did you decide to use it?

I used AI while developing the application. I used VS Code Copilot and Claude Sonnet 4.5 for coding. I created the prompts using GPT-5.2. These are the prompts I used to create the application in multiple iterations:

https://chatgpt.com/share/697aee1b-8fc0-800f-bb75-6b7e2009b2cc

**Why**: I use AI primarily as my coding assistant. AI is available to everyone, and software development takes less time with AI assistance. While the architecture of the application and structure of the code are still decided by me, the implementation of the code is done through AI assistance.
    
### Q2.1: What parts did AI help with?

AI was good in writing the initial boilerplate code and implementing feature developments. This includes:
- Setting up project structure and configuration files
- Implementing CRUD operations for authentication and orders
- Writing API endpoints and database queries
- Creating React components and styling
- Dockerizing the application with docker-compose setup

However, I retained full control over architectural decisions, database schema design, API structure, and overall system design.

### Q2.2: What parts did you choose to do yourself?

Once a feature was completed, sometimes it might be working, or the integration might not be done. In those cases, I debugged and fixed the code. 85% was developed by AI and I wrote 15% (mostly debugging issues).

### Q2.3: What tradeoffs influenced those choices?

Sometimes AI will do more than what is necessary, creating too many READMEs or unnecessary files. We should be very specific with what we want as part of the feature. Bug fix with debugging I often do manually because AI might not have complete context of the application. 

## Q3: If you were to iterate on this work in the future, would adding AI-powered functionality make sense?

I agree with AI-powered functionality integration in the system. I have included this in my system design video demonstration. [LINK](https://purdue0-my.sharepoint.com/:v:/g/personal/seesa01_purdue_edu/IQBwzrXL9VjeS5jYhG3AZaJ0ASeanGFpB3tlZtz27bUJ44A?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D&e=RFO1uE)

**I would use AI for:**

**Recommendations**: Based on mood and interest, we can suggest a pizza for new users. For existing users, we can use previous order data to suggest pizzas. We can target groups of users for promotional pizza advertisements.

**Feedback Evaluation**: Use AI to understand what customers are expecting and analyze customer sentiment.

**Inventory Management Prediction**: Based on location, time of year, weather, etc., we can increase/decrease the number of pizzas in store through AI predictions.

**Why AI would be appropriate**: In the above scenarios, AI can perform these tasks with high availability and cost-effectiveness. We can integrate AI in kiosks, phone call ordering, and drive-through, but the final checkout step I would like to keep manual.

**What you would not use AI for**: McDonald's integrated AI voice assistance in many drive through stores. They saw some false positive results where customers were frustrated, hence they reverted back to humans. I believe AI is still maturing and not at a stage where we can integrate it with everything. We need to make sure the customer is satisfied with the results and experience. 