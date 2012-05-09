/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM route management (handles drawing of route geometry - current route, old route, unnamed route, highlight unnamed streets) 
// [this holds the route geometry]

OSRM.Route = function() {
	this._current_route	= new OSRM.SimpleRoute("current" , {dashed:false} );
	this._old_route		= new OSRM.SimpleRoute("old", {dashed:false,color:"#123"} );
	this._unnamed_route	= new OSRM.MultiRoute("unnamed");
	
	this._current_route_style	= {dashed:false,color:'#0033FF', weight:5};
	this._current_noroute_style	= {dashed:true, color:'#222222', weight:2};
	this._old_route_style	= {dashed:false,color:'#112233', weight:5};
	this._old_noroute_style	= {dashed:true, color:'#000000', weight:2};
	this._unnamed_route_style = {dashed:false, color:'#FF00FF', weight:10};
	this._old_unnamed_route_style = {dashed:false, color:'#990099', weight:10};
	
//	this._route_history_styles = [{dashed:false, color:'#0033FF', weight:5},
//	                              {dashed:false, color:'#0011DD', weight:5},
//	                              {dashed:false, color:'#0000BB', weight:5},
//	                              {dashed:false, color:'#000099', weight:5},
//	                              {dashed:false, color:'#000077', weight:5}
//	                              ];
//	this._route_history = [];	
	
	this._noroute = OSRM.Route.ROUTE;
};
OSRM.Route.NOROUTE = true;
OSRM.Route.ROUTE = false;
OSRM.extend( OSRM.Route,{
	
	showRoute: function(positions, noroute) {
//		if( document.getElementById('option-show-previous-routes').checked == true)
//		if(!this._noroute) {
//		this._route_history.push( this._current_route );
//		if(this._route_history.length==6) {
//			this._route_history[0].hide();
//			this._route_history.splice(0,1);
//		}
//		for(var i=0,size=this._route_history.length; i<size; i++) {
//			this._route_history[i].setStyle( this._route_history_styles[i] );
//			this._route_history[i].show();
//		}
//		this._current_route = new OSRM.SimpleRoute("current" , {dashed:false} );
//		}
		this._noroute = noroute;
		this._current_route.setPositions( positions );
		if ( this._noroute == OSRM.Route.NOROUTE )
			this._current_route.setStyle( this._current_noroute_style );
		else
			this._current_route.setStyle( this._current_route_style );
		this._current_route.show();
		//this._raiseUnnamedRoute();
	},
	hideRoute: function() {
		this._current_route.hide();
		this._unnamed_route.hide();
//		this.clearHistoryRoutes();
		// activate printing
		OSRM.Printing.deactivate();		
	},
	hideAll: function() {
		this.hideRoute();
		this._old_route.hide();
		this._noroute = OSRM.Route.ROUTE;
	},
//	clearHistoryRoutes: function() {
//		for(var i=0,size=this._route_history.length; i<size; i++)
//			this._route_history[i].hide();
//		this._route_history[i] = [];
//	},
	
	showUnnamedRoute: function(positions) {
		this._unnamed_route.clearRoutes();
		for(var i=0; i<positions.length; i++) {
			this._unnamed_route.addRoute(positions[i]);	
		}
		this._unnamed_route.setStyle( this._unnamed_route_style );
		this._unnamed_route.show();
	},
	hideUnnamedRoute: function() {
		this._unnamed_route.hide();
	},
	// TODO: hack to put unnamed_route above old_route -> easier way in will be available Leaflet 0.4	
	_raiseUnnamedRoute: function() {
		if(this._unnamed_route.isShown()) {
			this._unnamed_route.hide();
			this._unnamed_route.show();
		}		
	},	
	showOldRoute: function() {
		this._old_route.setPositions( this._current_route.getPositions() );
		if ( this._noroute == OSRM.Route.NOROUTE)
			this._old_route.setStyle( this._old_noroute_style );
		else
			this._old_route.setStyle( this._old_route_style );
		this._old_route.show();
		this._raiseUnnamedRoute();
		// change color of unnamed route highlighting - no separate object as dragged route does not have unnamed route highlighting
		this._unnamed_route.setStyle( this._old_unnamed_route_style );
	},
	hideOldRoute: function() {
		this._old_route.hide();
	},
	
	isShown: function() {
		return this._current_route.isShown();
	},
	isRoute: function() {
		return !(this._noroute);
	},	
	getPositions: function() {
		return this._current_route.getPositions();
	},
	getPoints: function() {
		return this._current_route.getPoints();
	},	
	fire: function(type,event) {
		this._current_route.route.fire(type,event);
	},
	centerView: function() {
		this._current_route.centerView();
	}
});
