package org.act;

import java.rmi.RemoteException;

import org.apache.axis2.AxisFault;

public class RCSServiceClient {

	/**
	 * @param args
	 * @throws RemoteException 
	 */
	public static void main(String[] args) throws RemoteException {
		// TODO Auto-generated method stub
		MapGISServiceStub rstub = new MapGISServiceStub();
//		RCSServiceStub.ReadFileResponse  readfile = new RCSServiceStub.ReadFileResponse();
	//	readfile.setFilename("databaseinfo.txt");
		boolean flag1 = rstub.readFile().get_return();
		System.out.println(flag1);
		MapGISServiceStub.RegisterSensor registersensor= new MapGISServiceStub.RegisterSensor();
		registersensor.setFlag(0);
		registersensor.setInfo("0;'2013-4-7';'军用';4;121.23;31.25;0;0;100;0;");
		flag1 = rstub.RegisterSensor(registersensor).get_return();
		System.out.println(flag1);
		MapGISServiceStub.GetRecord getrecord = new MapGISServiceStub.GetRecord();
		getrecord.setFlag(0);
		getrecord.setId(3);
		String info = rstub.GetRecord(getrecord).get_return();
		System.out.println(info);
		MapGISServiceStub.GetRecordlist  grl= new MapGISServiceStub.GetRecordlist();
		grl.setFlag(0);
		info = rstub.GetRecordlist(grl).get_return();
		System.out.println(info);
//		MapGISServiceStub.GetObservation go = new MapGISServiceStub.GetObservation();
//		go.setInfo("'192.168.2.231';4040");
//		flag1 = rstub.GetObservation(go).get_return();
//		System.out.println(flag1);
	}

}
