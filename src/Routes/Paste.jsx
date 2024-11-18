import React from 'react'
import HomePage from '../screens/Home';
import Login from '../screens/404/Login';
import UserPages from '../screens/setting/user-pages';
import UserAgent from '../screens/setting/user-agent';
import UserInurance from '../screens/setting/user-insurance-buy';
import UserCompany from '../screens/setting/user-company';
import TypeInsuance from '../screens/setting/type-insurance';

import ContractItems from '../screens/company/Contract-items';
import ContractArrears from '../screens/company/Contract-arrears';
import ReportsPay from '../screens/company/Report-pay-insurnce';

import OptionInsurance from '../screens/setting/option-insurance';
import TypecarPage from '../screens/cars/type-car-page';
import BrancecarPage from '../screens/cars/brance-car-page';
import VersioncarPage from '../screens/cars/version-car-page';
import CompanyPage from '../screens/setting/company-page';
import RegisterCustomer from '../screens/action/register-customer';
import RegisterInsurance from '../screens/action/register-insurance';
import AgentPages from '../screens/action/agent-pages';
import CustomBuyer from '../screens/action/custom-buyer';
import EditCustomer from '../screens/action/form-edit-customer';
import FormBuyAdd from '../screens/action/formBuy-add';
import ReportSaleAll from '../screens/reports/report-sale-all';
import DebtCompany from '../screens/debt/debtCompany-pages';
import DebtAgent from '../screens/debt/debtAgent-page';
import DebtOac from '../screens/debt/debtOac-page';
import ReportCommisIncom from '../screens/reports/report-commis-incom';
import ReportCommisPay from '../screens/reports/report-commis-pay';
import ReportEndsCoverage from '../screens/reports/report-ends-coverage';
import ReportEndsCoverageCust from '../screens/custom-buy/report-ends-coverage-cust';
import ReportInsuranceHistory from '../screens/reports/report-insurance-history';
import FormEditInsurance from '../screens/action/form-edit-insurance';
import ReportPayDebtagen from '../screens/debt/report-pay-debtagen';
import ReportPayDebtcom from '../screens/debt/report-pay-debtcom';
import ReportPayDebtoac from '../screens/debt/report-pay-debtoac';
import DocInsurance from '../screens/document/doc-insurance';
import MoveInsurance from '../screens/action/register-move-insurance';
import RegisterRenew from '../screens/action/register-renew-insurance';
import FormRegistRenew from '../screens/action/form-regist-renew';
import ReportAlmostExpire from '../screens/reports/report-almost-expire';
import DocCommitoin from '../screens/document/doc-commitoin';
import CurrencyPage from '../screens/setting/currency-page';
import RetrunInsurance from '../screens/action/rigits-retrun-insurance';
import ReportRetrunAll from '../screens/lefun/Report-retrun-all';
import EditRetrun from '../screens/action/edit-retrun-insurance';
import RetrunCompany from '../screens/lefun/Retrun-company';
import RetrunAgent from '../screens/lefun/Retrun-agent';
import RetrunOacborker from '../screens/lefun/Retrun-oacborker';
import ComissionSale from '../screens/setting/Comission-Sale';
import CommissionPay from '../screens/setting/Commission-Pay';

import ReportCommition from '../screens/agents/Report-commition';
import ReportPaycommition from '../screens/agents/Report-Paycommition';
import ReportInsuranteAgent from '../screens/agents/Report-insurante-agent';
import ReportDebtPayAgent from '../screens/reports/report-debt-pays-agent';
import ContractArrearsEx from '../screens/company/Contract-arrears-ex';

import ReportInsurnceBuy from '../screens/custom-buy/report-insurnce-buy';
import HistoryInsurnceBay from '../screens/custom-buy/history-insurnce-buy';
import InsuranceRetrun from '../screens/custom-buy/insurance-rutrun';
import ReportDebtCustomer from '../screens/reports/report-debt-customer'
import ReportEndContract from '../screens/company/Report-End-Contract';
import ReportHistoryConntract from '../screens/company/Report-History-Conntract';
import { Routes, Route, Navigate } from 'react-router-dom';
export default function AppContent() {
  return (
    <Routes>
        <Route path='/' element={<Navigate replace to="login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/user" element={<UserPages />} />
            <Route path="/user-ag" element={<UserAgent />} />
            <Route path="/user-buy" element={<UserInurance />} />
            <Route path="/user-cn" element={<UserCompany />} />
            <Route path="/item" element={<ContractItems />} />
            <Route path="/arrearsIn" element={<ContractArrears />} />
            <Route path="/arrearsEx" element={<ContractArrearsEx />} />
            <Route path="/type-in" element={<TypeInsuance />} />
            <Route path="/report-pay" element={<ReportsPay />} />
            <Route path="/option" element={<OptionInsurance />} />
            <Route path='/type-car' element={<TypecarPage />}/>
            <Route path='/brand' element={<BrancecarPage />}/>
            <Route path='/version' element={<VersioncarPage />}/>
            <Route path='/company' element={<CompanyPage />}/>
            <Route path='/custom' element={<CustomBuyer />}/>
            <Route path='/regits' element={<RegisterCustomer />}/>
            <Route path='/contract' element={<RegisterInsurance />}/>
            <Route path='/agent' element={<AgentPages />}/>
            <Route path='/editCus' element={<EditCustomer />}/>
            <Route path='/regis-more' element={<FormBuyAdd />}/>
            <Route path='/report' element={<ReportSaleAll />}/>
            <Route path='/debt' element={<DebtCompany />}/>
            <Route path='/debt-agent' element={<DebtAgent />}/>
            <Route path='/debt-oac' element={<DebtOac />}/>
            <Route path='/comsIn' element={<ReportCommisIncom />}/>
            <Route path='/comsPay' element={<ReportCommisPay />}/>
            <Route path='/report-ends' element={<ReportEndsCoverage />}/>
            <Route path='/ins-ends-cust' element={<ReportEndsCoverageCust />}/>
            <Route path='/history' element={<ReportInsuranceHistory />}/>
            <Route path='/editIn' element={<FormEditInsurance />}/>
            <Route path='/r-debcom' element={<ReportPayDebtcom />}/>
            <Route path='/r-debagent' element={<ReportPayDebtagen />}/>
            <Route path='/r-deboac' element={<ReportPayDebtoac />}/>
            <Route path='/doc' element={<DocInsurance />}/>
            <Route path='/move-contract' element={<MoveInsurance />}/>
            <Route path='/regis-renew' element={<RegisterRenew />}/>
            <Route path='/from-renew' element={<FormRegistRenew />}/>
            <Route path='/almost' element={<ReportAlmostExpire />}/>
            <Route path='/doct-com' element={<DocCommitoin />}/>
            <Route path='/currency' element={<CurrencyPage />}/>
            <Route path='/rigits-retrun' element={<RetrunInsurance />}/>
            <Route path='/retrun-all' element={<ReportRetrunAll />}/>
            <Route path='/editReturn' element={<EditRetrun />}/>
            <Route path='/retrun-company' element={<RetrunCompany />}/>
            <Route path='/retrun-agent' element={<RetrunAgent />}/>
            <Route path='/retrun-oac' element={<RetrunOacborker />}/>
            <Route path='/comission' element={<ComissionSale/>}/>
            <Route path='/comisaget' element={<CommissionPay/>}/>
            <Route path='/r-debt' element={<ReportDebtPayAgent />} />
            <Route path='/r-commit' element={<ReportCommition/>}/>
            <Route path='/r-payAgent' element={<ReportPaycommition/>}/>
            <Route path='/report-ag' element={<ReportInsuranteAgent/>}/>
            <Route path='/report-c' element={<ReportInsurnceBuy/> } />
            <Route path='/history-c' element={<HistoryInsurnceBay/> } />
            <Route path='/retrun-c' element={<InsuranceRetrun />} />
            <Route path='/rc-debt' element={<ReportDebtCustomer />} />
            <Route path='/arrearscm' element={<ReportEndContract />} />
            <Route path='/history-cm' element={<ReportHistoryConntract />} />

            
        </Routes>
  )
}
