TASK & Questions


# TASK #

1. The add asset modal should be capable of adding new room and floor as well, like the same function for the category. 

2. The tag should be auto filled since what i set in that is for example AS-01, AS-02, etc etc. So it shuld always be incrementing depending on how many assets are in the database.

target file : [web\components\asset\AssetRegistry.tsx]


# QUESTION # 

Does the qr being showned and generated in here are connected with the qr api endpoints or this is just a static? If the qr is stil static, Connect it to the api endpoint and i also think that the qr should be expandable, printable, or as is since the current display of it is kinda small. 

I also think for the qr is when you try running it on your normal phone scanner it should display a simple text jsut for the confirmation since currently the mobile application of the system is not yet built that's why we just need a validator. 

# API File #

QR [api\v1\qr]
Assets [api\v1\assets]