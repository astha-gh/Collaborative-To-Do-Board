## How you implemented Smart Assign

Smart Assign gives the task to the user with the fewest tasks. This is done so that the tasks are distributed fairly among all users.
So, to implement it we need to first give all tasks and all users to the smart assign button, specifically to the function that handles the smart assign button. This is done through props.
Once this is done we count the number of active tasks(To-do and In-Progress) of every user.
The user with the least number of tasks is assigned to do the task.
If more than one user has the same number of least tasks then the selection is done randomly.


## How your conflict handling works, with examples if possible

When two users are editing the same task at the same time and hit the edit button, a conflict error occurs.
This conflict is detected using timestamps.
This conflict can be resolved by either overwriting the server's(another user's) task or by merging both versions of your task.

Example of Overwrite:
Server Version: 5 mins Pranayam
Client Version: 5 mins Kapaalbhati
Task description: 5 mins Kapaalbhati

Example of Merge:
Server Version: 5 mins Pranayam
Client Version: 5 mins Kapaalbhati
Task description: 5 mins Pranayam  5 mins Kapaalbhati

