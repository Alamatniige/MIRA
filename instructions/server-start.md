# SERVER START

# Directory path where we should run the the command
- C:\Users\msi thin\Documents\Code\OJT\MIRA 
(paltan mo nalang kasi directory ng laptop ko to, basta yung directory na MIRA)

# IF WE USE THE SUPABASE DB CONNECTION (Not on Duty)
```powershell
.\start-api.ps1 production
```

# IF WE USE THE LOCAL DB CONNECTION (On Duty)
```powershell
.\start-api.ps1 local
```

Before running the local database, make sure that docker is running. 