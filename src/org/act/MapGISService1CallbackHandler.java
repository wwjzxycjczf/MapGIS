
/**
 * MapGISService1CallbackHandler.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis2 version: 1.4.1  Built on : Aug 19, 2008 (10:13:39 LKT)
 */

    package org.act;

    /**
     *  MapGISService1CallbackHandler Callback class, Users can extend this class and implement
     *  their own receiveResult and receiveError methods.
     */
    public abstract class MapGISService1CallbackHandler{



    protected Object clientData;

    /**
    * User can pass in any object that needs to be accessed once the NonBlocking
    * Web service call is finished and appropriate method of this CallBack is called.
    * @param clientData Object mechanism by which the user can pass in user data
    * that will be avilable at the time this callback is called.
    */
    public MapGISService1CallbackHandler(Object clientData){
        this.clientData = clientData;
    }

    /**
    * Please use this constructor if you don't want to set any clientData
    */
    public MapGISService1CallbackHandler(){
        this.clientData = null;
    }

    /**
     * Get the client data
     */

     public Object getClientData() {
        return clientData;
     }

        
           /**
            * auto generated Axis2 call back method for ConfigureSensorByID method
            * override this method for handling normal response from ConfigureSensorByID operation
            */
           public void receiveResultConfigureSensorByID(
                    org.act.MapGISService1Stub.ConfigureSensorByIDResponse result
                        ) {
           }

          /**
           * auto generated Axis2 Error handler
           * override this method for handling error response from ConfigureSensorByID operation
           */
            public void receiveErrorConfigureSensorByID(java.lang.Exception e) {
            }
                
           /**
            * auto generated Axis2 call back method for GetState method
            * override this method for handling normal response from GetState operation
            */
           public void receiveResultGetState(
                    org.act.MapGISService1Stub.GetStateResponse result
                        ) {
           }

          /**
           * auto generated Axis2 Error handler
           * override this method for handling error response from GetState operation
           */
            public void receiveErrorGetState(java.lang.Exception e) {
            }
                
           /**
            * auto generated Axis2 call back method for GetObservation method
            * override this method for handling normal response from GetObservation operation
            */
           public void receiveResultGetObservation(
                    org.act.MapGISService1Stub.GetObservationResponse result
                        ) {
           }

          /**
           * auto generated Axis2 Error handler
           * override this method for handling error response from GetObservation operation
           */
            public void receiveErrorGetObservation(java.lang.Exception e) {
            }
                
           /**
            * auto generated Axis2 call back method for GetDescription method
            * override this method for handling normal response from GetDescription operation
            */
           public void receiveResultGetDescription(
                    org.act.MapGISService1Stub.GetDescriptionResponse result
                        ) {
           }

          /**
           * auto generated Axis2 Error handler
           * override this method for handling error response from GetDescription operation
           */
            public void receiveErrorGetDescription(java.lang.Exception e) {
            }
                
           /**
            * auto generated Axis2 call back method for GetCapablities method
            * override this method for handling normal response from GetCapablities operation
            */
           public void receiveResultGetCapablities(
                    org.act.MapGISService1Stub.GetCapablitiesResponse result
                        ) {
           }

          /**
           * auto generated Axis2 Error handler
           * override this method for handling error response from GetCapablities operation
           */
            public void receiveErrorGetCapablities(java.lang.Exception e) {
            }
                
           /**
            * auto generated Axis2 call back method for readFile method
            * override this method for handling normal response from readFile operation
            */
           public void receiveResultreadFile(
                    org.act.MapGISService1Stub.ReadFileResponse result
                        ) {
           }

          /**
           * auto generated Axis2 Error handler
           * override this method for handling error response from readFile operation
           */
            public void receiveErrorreadFile(java.lang.Exception e) {
            }
                


    }
    