const WTSA_URL = "https://api-dev.psi-connect.org/TTS.whatsappMsgTest";

// var $ = jQuery = require("jquery");

// const { JSDOM } = require( 'jsdom' );
// const jsdom = new JSDOM();
// const { window } = jsdom;
// const { document } = window;
// global.window = window;
// global.document = document;

// const $ = global.jQuery = require( 'jquery' );
// console.log( `jQuery ${jQuery.fn.jquery} working! Yay!!!` );

const axios = require('axios');

const {ServerUtils} = require("./utils");
const serverUtils = new ServerUtils();
const MessagesCollection = require("../models/messages");
const UsersCollection = require("../models/users");

class MessageUtils {
    constructor( ) {
       
	}

	sendWtsaMessage( sendUsername, receiveUsername, message ) {
        let me = this;

        UsersCollection.find().or([
            { username: sendUsername },
            { username: receiveUsername }
        ])
        .then(( list ) => {
            console.log( list.length );
            if(list.length == 2 )
            {
                const senderUser = serverUtils.findItemFromList( list, sendUsername, "username" );
                const receiveUser = serverUtils.findItemFromList( list, receiveUsername, "username" );
                if( receiveUser.wtsa != undefined )
                {
                    const data = {
                        "msgJson": {
                            "msg": message,
                            "toPhoneNumber": receiveUser.wtsa,
                            "fromPhoneNumber": senderUser.wtsa 
                        } 
                    }
                    console.log( "------- data :" );
                    console.log( data );

                    
                    axios.post(WTSA_URL, data )
                    .then(function (response) {
                        console.log("-- The message is sent to Whatsapp.");
                    })
                    .catch(function (err) {
                        console.log("-- The message couldn't be sent to Whatsapp." + err.message );
                        console.log(err);
                    });

                    // $.ajax({
                    //     url: WTSA_URL,
                    //     type: "POST",
                    //     dataType: "JSON",
                    //     data: data
                    // }).done(function( json ){
                    //     console.log("-- The message is sent to Whatsapp.");
                    // }).fail( function( xhr, status, err ){
                    //     console.log("-- The message couldn't be sent to Whatsapp." + err.message );
                    // })
                }
            }
        })


      

        

    }
}

module.exports = {
    MessageUtils
};
