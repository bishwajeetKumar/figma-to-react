Help me create a agentic workflow involving below activities and break the below activities to as smaller agents as possible so that I can plug and play individual agents as needed
Login to jira using jira mcp and fetch the jiras assigned to me
Once fetched give me prompt to select the jira I want to pick up
once the selection is done, understand the requirement of the story and read through the details in the description as well as the acceptance criteria for the same
from the jira type stories/defect create branch from bitbucket as feature or bugfix using bitbucket mcp in the required microapp repo
Look for any figma file link in the jira to understand the requirement if not avaialble prompt for the link input and using figma to MDS mcp create the required pages and functionality using description in the jira
Once the changes are done add change related test cases and make sure the coverage is 100% for the new change
Once the changes are done run below command to test the change 
npm install
npm run dev
wiremock dev
./node_modules/.bin/cxohostapp 8080
Once completed load the change in a browser and add in a human intervention to accept the change based on the Figma comparision side by side
If not accepted look for the input and redo the needed change with unit test case update
once accepted commit the change and push the feature/bugfix branch created
