
const UsersCollection = require("../models/users");
const {ServerUtils} = require("./utils");
const serverUtils = new ServerUtils();

const UserManagement = class {
	constructor( username1, username2 ) {
		this.username1 = username1;
		this.username2 = username2;
		this.status = [];
	}

	createIfNotExist( exeFunc ) {
		UsersCollection.find().or([
			{ username: this.username1 },
			{ username: this.username2 }
		]).then(( list ) => {
			var me = this;
			if( list.length == 1 )
			{
				if( list[0].username == this.username1 )
				{
					this.create( me.username2, me.username1, function(){
						me.updateContact( list[0], me.username2, function( newUserData ) {
							exeFunc( [newUserData] );
						} );
					} );
					
				}
				else if( list[0].username == this.username2 )
				{
					this.create( me.username1, me.username2, function(){
						me.updateContact( list[0], me.username1, function( newUserData ) {
							exeFunc( [newUserData] );
						} );
					} );
				}
			}
			else if( list.length == 0 )
			{
				this.create(me.username1, me.username2, function( ){
					me.create(me.username2, me.username1, function(){
						exeFunc(); // Should put the userData for username1 and username2
					});
				});
				
			}
			else if( list.length == 2 )
			{
				// Check ContactList and update
				if( list[0].username == this.username1 )
				{
					me.updateContact( list[0], me.username2, function() {
						me.updateContact( list[1], me.username1, function(){
							exeFunc();
						} )
					})
				}
				else
				{
					me.updateContact( list[0], me.username1, function() {
						me.updateContact( list[1], me.username2, function(){
							exeFunc();
						} )
					})
				}
			}
		});
	};

	create( username, contact, exeFunc ) {
		const data = {
			username: username,
			fullName: username,
			contacts: [{contactName: contact, hasNewMessages: false}]
		}

		// Save message to mongodb
		const user = new UsersCollection( data );
		user.save(function(err){
			console.log("saved .");
			if( exeFunc ) exeFunc();
		})
	}

	updateContact( userData, contactName, exeFunc ) {
		const found = serverUtils.findItemFromList( userData.contacts, contactName, "contactName");
		if( !found )
		{
			userData.contacts.push({ contactName: contactName, hasNewMessages: true } );

			userData.save(function(err){
				if( exeFunc ) exeFunc( userData );
			});
		}
		else
		{
			if( exeFunc ) exeFunc( userData );
		}
		
	}
};

module.exports = UserManagement;