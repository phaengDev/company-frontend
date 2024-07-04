import React,{useState,useEffect} from "react";
import { Config } from "./connenct";
const api = Config.urlApi;

export function useProvince() {
  const [itemProvince, setItemProvince] = useState([]);
  useEffect(() => {
    const showProvince = async () => {
      try {
        const response = await fetch(api + 'province');
        const jsonData = await response.json();
        setItemProvince(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    showProvince();
  }, []); 
  const data = itemProvince.map(item => ({ label: item.province_name, value: item.province_id }));
  return data;
}

export function useCompany() {
  const [itemCompany, setItemCompany] = useState([]);
  useEffect(() => {
    const showCompany = async () => {
      try {
        const response = await fetch(api + 'company/fetch');
        const jsonData = await response.json();
        setItemCompany(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    showCompany();
  }, []); 
  const data = itemCompany.map(item => ({ label: item.com_name_lao, value: item.company_Id }));
  return data;
}


export function useAgent() {
  const [itemAgent, setItemAgent] = useState([]);
  useEffect(() => {
    const showAgent = async () => {
      try {
        const response = await fetch(api + 'agent/option');
        const jsonData = await response.json();
        setItemAgent(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    showAgent();
  }, []); 
  const data = itemAgent.map(item => ({ label: item.agent_name, value: item.agent_Id }));
  return data;
}


export function useType() {
  const [itemType, setItemType] = useState([]);
  useEffect(() => {
    const showType = async () => {
      try {
        const response = await fetch(api + 'type-ins/');
        const jsonData = await response.json();
        setItemType(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    showType();
  }, []); 
  const data = itemType.map(item => ({ label: item.type_in_name, value: item.type_insid }));
  return data;
}

export function useTypeCar() {
  const [itemTypecar, setItemTypecar] = useState([]);
  useEffect(() => {
    const showTypecar = async () => {
      try {
        const response = await fetch(api + 'typecar/');
        const jsonData = await response.json();
        setItemTypecar(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    showTypecar();
  }, []); 
  const data = itemTypecar.map(item => ({ label: item.typecar_name, value: item.typecar_Id }));
  return data;
}


export function useBrandCar() {
  const [itemBrandCar, setItemBradCar] = useState([]);
  useEffect(() => {
    const showBrandCar = async () => {
      try {
        const response = await fetch(api + 'brands/');
        const jsonData = await response.json();
        setItemBradCar(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    showBrandCar();
  }, []); 
  const data = itemBrandCar.map(item => ({ label: item.brands_name, value: item.brands_Id }));
  return data;
}


export function useVersion() {
  const [itemVersion, setItemVersion] = useState([]);
  useEffect(() => {
    const showVersionCar = async () => {
      try {
        const response = await fetch(api + 'version/');
        const jsonData = await response.json();
        setItemVersion(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    showVersionCar();
  }, []); 
  const data = itemVersion.map(item => ({ label: item.version_name, value: item.version_Id }));
  return data;
}


export function useTypeBuyer() {
  const [itemBuyer, setItemBuyer] = useState([]);
  useEffect(() => {
    const showTypeBuyer = async () => {
      try {
        const response = await fetch(api + 'type-ins/typebuy');
        const jsonData = await response.json();
        setItemBuyer(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    showTypeBuyer();
  }, []); 
  const data = itemBuyer.map(item => ({ label: item.type_buyer_name, value: item.type_buyer_id }));
  return data;
}


export function useCurrency() {
  const [itemCurrency, setItemCurrency] = useState([]);
  useEffect(() => {
    const showCurrency = async () => {
      try {
        const response = await fetch(api + 'currency/');
        const jsonData = await response.json();
        setItemCurrency(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    showCurrency();
  }, []); 
  const data = itemCurrency.map(item => ({ label: item.currency_name+'/'+item.genus, value: item.currency_id }));
  return data;
}