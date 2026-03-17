# Task 1 [COMPLETED]

We need to implement backend functionality in the reports page. I think we need a new way of saving a location since there will be a feature in here where it visualize how many assets are in each room per floor.

Can you analyze the database if we can handle those data and if not, we need to discuss those fields that we needed to add on the database.

Foldes/Files to investigate and analyze :

[` web\components\report `]
[` api\v1\reports `]

# Note

Any issues or clarification should be answered by me, so this task will be set to planning first so we can clarify the whole process of this area first.

# Task 2 [COMPLETED]

REFRACTOR ROOM & FLOOR MODULE

Since there's a new process of adding a room and floor, as well confusing level of the floor. What if the creation of another room and floor will be located in different modal? Instead of embedding the addition of another room in the add asset modal, we'll be creating a separated add location modal.

The content of this modal will be room and floor, indicating what is the level is for and assigning a newly added room into its proper floor.

Now, since we will be creating this new processm we will not set a fixed value's readed in database for the add asset modal (room and floor) inputs. We will just add a plus button beside the input to indicate that we can always add a new location for the assets and upon clicking the plus button it will close the add asset modal then it will open the add location modal.

I think we would be tweaking fields for it so tell me which part you will remove and add in the database.

# File to investigate and analyze.

- [` web\components\asset\AssetRegistry.tsx `] Line - 1140 - 1743 (ADD ASSET MODAL)
- [` web\components\asset\AssetRegistry.tsx `] Line - 2018 - 2725 (EDIT ASSET MODAL)

# TASK 3 [COMPLETED]

I noticed some descripancy in here where if i open the manage locations and succesfully adding, editing, or deleting an room or floor. The modal is closing, I think it would be much better to not let the modal to be closed upon succesful function

# TASK 4 [PLANNING]

I have a few observation for the manage location modal again, those existing data is not being displayed as ascending? Supposedly it is from id 1 - 5, but it is mixed up.

I also noticed something in the edit asset modal and add asset modal where the user's are allowed to choose separated value for room and floor. What if the user choose a non existing room for this floor? Like for example Floor 1 only has Room 1 and Room 2, but the user add the asset in Room 3 and Floor 1. There's a bug in it, Instead of letting them to choose separately, why not let's make it as a location input? Where room and floor is joint, user can search in the input bar and can choose existing data. Now if they want to add, the plus button will still be there.

I also think that manual input of position would be harder for the admin to understand, so maybe we can just automatically add a pre-set value for the position and sizes of each room, then it will only automatically add the room in the visualization properly, not stocking. Probably limit it to 5 columns only so it won't take too big in visualization.
