
/**
 * MapGISServiceCallbackHandler.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis2 version: 1.4.1  Built on : Aug 19, 2008 (10:13:39 LKT)
 */

    package org.act;

    /**
     *  MapGISServiceCallbackHandler Callback class, Users can extend this class and implement
     *  their own receiveResult and receiveError methods.
     */
    public abstract class MapGISServiceCallbackHandler{



    protected Object clientData;

    /**
    * User can pass in any object that needs to be accessed once the NonBlocking
    * Web service call is finished and appropriate method of this CallBack is called.
    * @param clientData Object mechanism by which the user can pass in user data
    * that will be avilable at the time this callback is called.
    */
    public MapGISServiceCallbackHandler(Object clientData){
        this.clientData = clientData;
    }

    /**
    * Please use this constructor if you don't want to set any clientData
    */
    public MapGISServiceCallbackHandler(){
        this.clientData = null;
    }

    /**
     * Get the client data
     */

     public Object getClientData() {
        return clientData;
     }

        
           /**
            * auto generated Axis2 call back method for RegisterSensor method
            * override this method for handling normal response from RegisterSensor operation
            */
           public void receiveResultRegisterSensor(
                    org.act.MapGISServiceStub.RegisterSensorResponse result
                        ) {
           }

          /**
           * auto generated Axis2 Error handler
           * override this method for handling error response from RegisterSensor operation
           */
            public void receiveErrorRegisterSensor(java.lang.Exception e) {
            }
                
           /**
            * auto generated Axis2 call back method for GetRecordlist method
            * override this method for handling normal response from GetRecordlist operation
            */
           public void receiveResultGetRecordlist(
                    org.act.MapGISServiceStub.GetRecordlistResponse result
                        ) {
           }

          /**
           * auto generated Axis2 Error handler
           * override this method for handling error response from GetRecordlist operation
           */
            public void receiveErrorGetRecordlist(java.lang.Exception e) {
            }
                
           /**
            * auto generated Axis2 call back method for GetRecord method
            * override this method for handling normal response from GetRecord operation
            */
           public void receiveResultGetRecord(
                    org.act.MapGISServiceStub.GetRecordResponse result
                        ) {
           }

          /**
           * auto generated Axis2 Error handler
           * override this method for handling error response from GetRecord operation
           */
            public void receiveErrorGetRecord(java.lang.Exception e) {
            }
                
           /**
            * auto generated Axis2 call back method for readFile method
            * override this method for handling normal response from readFile operation
            */
           public void receiveResultreadFile(
                    org.act.MapGISServiceStub.ReadFileResponse result
                        ) {
           }

          /**
           * auto generated Axis2 Error handler
           * override this method for handling error response from readFile operation
           */
            public void receiveErrorreadFile(java.lang.Exception e) {
            }
                


    }
    