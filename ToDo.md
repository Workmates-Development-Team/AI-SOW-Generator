# Frontend

## Generator

- Need to add a variable system that updates the request for generation in the system prompt based on the input fields used
- Need a toolbar which houses the list view and the logout button

### Points to be added in the SOW as per customer's requirement:
- Contact information
- Index/Table of Contents
- About the company
- Executive Summary
- Urgency and Impact
- Service level agreement if any : currently partially implemented, need to accept the llm response on the condition that the user provided additional constraints
- A section for things not included
- Optionally RACI matrix

## SOW List

- Add a thumbnail view that displays the first slide to represent the saved document

## SOW Viewer

- The content splitter works only for the mixed, list and text type content right now, it requires an exception condition to work for table (Important)
- The downloaded PDFs currently are slightly misaligned (Crucial)
- The objective and the assumptions and constraints pages overflow

# Backend

- The db should also save the prompt given by the user for future reference or use