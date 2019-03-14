# **RPS-Multiplayer**
This is a fully functional multiplayer rock-paper-scissors game, with chat functionality, built with jQuery and Firebase. It was a fun, quick thing to put together to get more practice working with the Firebase database, which I hadn't used before. 

### **Features**
* A user may only sign in once, and no one can sign in after two users have signed up to play
* The chat function is open to anybody, including observers. All observers are given the handle of "Anon." Only the players are given named handles.
* When a player signs off, their data disappears and someone may sign in to replace them. The other player's stats are saved until they quit.
* If all users sign off, the system is set up to reset the game conditions when the next first user signs on to play a fresh round.

### **Challenges**
The big challenge was figuring out how to capture the unique user key for each user who logs on, but once I did that, building the logic to prevent multiple sign-ins by one person or inadvertent clicks by the wrong player (or watcher) was easy.

The site incorporates two other databases, too: a game database, where the current conditions of play are set, and a chat database, where the chat history is stored.

### **Working with Firebase**
Gotta be honest, it wasn't my favorite. The documentation's pretty much only for advanced site-building, with explanations of how to sign up users with an authorization screen or through authentication through Google. I needed the instructions on how to walk before I could run.

I had to spend a lot of time with it and searching on other forums to start to understand what was going on. Got there in the end, though!