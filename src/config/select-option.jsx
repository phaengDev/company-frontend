import React, { useState, useEffect } from "react";
import { Config } from "./connenct";
const api = Config.urlApi;

export function useStatus() {
  const [itemStatus, setItemStatus] = useState([]);
  useEffect(() => {
    const showStatus = async () => {
      try {
        const response = await fetch(api + 'status');
        const jsonData = await response.json();
        setItemStatus(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    showStatus();
  }, []);
  const data = itemStatus.map(item => ({ label: item.status_name, value: item.stauts_use_id }));
  return data;
}

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

export function useDistrict(id) {
  const [itemDistrict, setItemDistrict] = useState([]);
  useEffect(() => {
    const showDistrict = async () => {
      try {
        const response = await fetch(api + `district/pv/${id}`);
        const jsonData = await response.json();
        setItemDistrict(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    showDistrict();
  }, [id]);
  const dataDist = itemDistrict.map(item => ({ label: item.district_name, value: item.district_id }));
  return dataDist;
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
  const data = itemCompany.map(item => ({ label: item.com_name_lao, value: item.company_Id ,name_eng:item.com_name_eng}));
  return data;
}


export function useCompanyCust(id) {
  const [itemCompany, setItemCompany] = useState([]);
  useEffect(() => {
    const showCompanyCust = async () => {
      try {
        const response = await fetch(api + 'company/cust/'+id);
        const jsonData = await response.json();
        setItemCompany(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    showCompanyCust();
  }, [id]);
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


export function useAgentCust(id) {
  const [itemAgent, setItemAgent] = useState([]);
  useEffect(() => {
    const showAgentCust = async () => {
      try {
        const response = await fetch(api + 'agent/cust/'+id);
        const jsonData = await response.json();
        setItemAgent(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    showAgentCust();
  }, [id]);
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


export function useTypeCust(id) {
  const [itemType, setItemType] = useState([]);
  useEffect(() => {
    const showTypeCust = async () => {
      try {
        const response = await fetch(api + 'type-ins/cust/'+id);
        const jsonData = await response.json();
        setItemType(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    showTypeCust();
  }, [id]);
  const data = itemType.map(item => ({ label: item.type_in_name, value: item.type_insid }));
  return data;
}


// ================ company =============


export function useTypeCm(id) {
  const [itemType, setItemType] = useState([]);
  useEffect(() => {
    const showTypeCm = async () => {
      try {
        const response = await fetch(api + 'type-ins/cm/'+id);
        const jsonData = await response.json();
        setItemType(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    showTypeCm();
  }, [id]);
  const data = itemType.map(item => ({ label: item.type_in_name, value: item.type_insid }));
  return data;
}




export function useOption(id) {
  const [itemOption, setItemOption] = useState([]);
  useEffect(() => {
    const showOptionCm = async () => {
      try {
        const response = await fetch(api + 'options/t/'+id);
        const jsonData = await response.json();
        setItemOption(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    showOptionCm();
  }, [id]);
  const data = itemOption.map(item => ({ label: item.options_name, value: item.options_Id }));
  return data;
}
// ===================\\\

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
  const data = itemCurrency.map(item => ({ label: item.currency_name + '/' + item.genus, value: item.currency_id }));
  return data;
}



export function useCustomBuy() {
  const [itemCustomBuy, setItemCustomBuy] = useState([]);
  useEffect(() => {
    const showCustomBuy = async () => {
      try {
        const response = await fetch(api + 'custom/option/2202');
        const jsonData = await response.json();
        setItemCustomBuy(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    showCustomBuy();
  }, []);
  const data = itemCustomBuy.map(item => ({ label: item.customer_name, value: item.custom_uuid }));
  return data;
}
