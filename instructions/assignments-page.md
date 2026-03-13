# TASK

Assignment Page, assignment API Endpoints integration.

Re-read the assignment page again since there's a new UI layout for it and may be some inputs has changed.

The assignment page purpose is to allow the admin to have a direct assignment of an asset to the staff. When the admin clicks and open the assign asset modal, it will give him a bunch of field where it can select an asset and user and assign the asset to that user.

After succesfully filling up the fields and clicking the confirm. It will now open the memo file where the admin can print the memo for their physical agreement.

After it, the status of the assigned asset will become pending not unless the admin click the confirm button in the action column.

# - - - - N O T E - - - -

Since you recently reads and analyzed the assignment pages, please define and tell me if i need to add some new columns on the table so i can add them manually.

Department

- This area should be fetched in the user.department field

# Mentioned File / Related File and Folder

[`api\v1\assignments`] - assignment go api folder
[`web\components\assignment\AssignmentView.tsx`] - assignment fe page
[`web\types\mira.ts`] - website types
[`web\hooks\useAssignments.ts`] - assignment hooks
[`web\app\api\assignments`] - next api proxy server
