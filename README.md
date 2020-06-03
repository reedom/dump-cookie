dump-cookie
===========

Open an empty Chrome browser, dump cookies on termination.

Motivation
----------

[Puppeteer][] is a savior that save us from boring tasks by enabling us to build web automation tools, however, some sites block Puppeteer's magic wand through libraries like reCAPCHA.
To bypass those circumstances, reusing a healthy cookie could be a help sometimes.
This program dumps cookies for you.

[Puppeteer]: https://pptr.dev/

Installation
------------

    git clone https://github.com/reedom/dump-cookie
    cd dump-cookie
    yarn install
    

Usage instruction
-----------------

1. Open a terminal window and invoke the program.  
   It will open a new Chrome window with 2 tabs.  

   _The first tab contains a normal page._  
   _The second tab is under the control of Puppeteer._

    ```shell
    cd path/to/dump-cookie
    yarn run start
    ```



2. Move to the first tab, and then visit any web site and do login, etc.
3. Open the same webpage in the second tab, with a hope that it'd load the same cookies with the first tab.
4. Back to the terminal window and press `CTRL-C`.  
   You'll have a cookies' dump string.
5. Save and use it in your program.  
   For example:  

    ```javascript
    const cookies = JSON.parse(DUMPED_COOKIES);
    await page.setCookie(...cookies);
    ```

License
-------

MIT

