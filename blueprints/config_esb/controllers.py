# IMPORT Library
import os, json
import datetime as dt
from flask_restful import Resource, reqparse
from flask import request, current_app
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    get_jwt,
)

# IMPORT Local Setting
import libraries.generate_response as generateResp
import blueprints.config_esb.models as esbConfigModels
import blueprints.global_parameters.models as globalParamModels


class ServiceList(Resource):
    @classmethod
    @jwt_required()
    def get(cls):
        try:
            qry_param = request.args.to_dict()
            if not qry_param :
                return generateResp.badRequest(message="Query param cannot be empty!")
            else :
                mono_dc_service_data = esbConfigModels.find_list_service_id(db_site="ESB_MONOLITH_DC", input_param=qry_param)
                if mono_dc_service_data :
                    mono_dc_service_data_status = True
                else :
                    mono_dc_service_data_status = False

                mono_drc_service_data = esbConfigModels.find_list_service_id(db_site="ESB_MONOLITH_DRC", input_param=qry_param)
                if mono_drc_service_data :
                    mono_drc_service_data_status = True
                else :
                    mono_drc_service_data_status = False

                mono_odc_service_data = esbConfigModels.find_list_service_id(db_site="ESB_MONOLITH_ODC", input_param=qry_param)
                if mono_odc_service_data :
                    mono_odc_service_data_status = True
                else :
                    mono_odc_service_data_status = False

                msr_service_data = esbConfigModels.find_list_service_id(db_site="ESB_MSR", input_param=qry_param)
                if msr_service_data :
                    msr_service_data_status = True
                else :
                    msr_service_data_status = False

                respBody = {
                    "ESB_monolith_DC_status" : mono_dc_service_data_status,
                    "ESB_monolith_DC_data" : mono_dc_service_data,
                    "ESB_monolith_DRC_status" : mono_drc_service_data_status,
                    "ESB_monolith_DRC_data" : mono_drc_service_data,
                    "ESB_monolith_ODC_status" : mono_odc_service_data_status,
                    "ESB_monolith_ODC_data" : mono_odc_service_data,
                    "ESB_MSR_status" : msr_service_data_status,
                    "ESB_MSR_data" : msr_service_data,
                }

                return (
                    generateResp.success(respBody=respBody)
                    if respBody
                    else generateResp.noContent()
                )

        except Exception as why:
            current_app.logger.warning(repr(why))
            return generateResp.generalError(exceptionMessage=repr(why))

class ServiceUpdate(Resource):
    @classmethod
    @jwt_required()
    def patch(cls, service_id :str):
        try :
            request_json = request.get_json()
            if (request_json["siteDBESB"] is not None and request_json["siteDBESB"] != ""):
                pass
            else:
                raise ValueError("siteDBESB cannot be empty")
            if (request_json["newServiceId"] is not None and request_json["newServiceId"] != ""):
                pass
            else:
                raise ValueError("newServiceId cannot be empty")
            if (request_json["esbSvcName"] is not None and request_json["esbSvcName"] != ""):
                pass
            else:
                raise ValueError("esbSvcName cannot be empty")

            list_site_db_esb = request_json["siteDBESB"].split(",")
            result = []
            for data in list_site_db_esb :
                esb_data_before = esbConfigModels.find_service_by_service_id_name(db_site=data, service_id=service_id, esb_service_name=request_json["esbSvcName"])
                esb_status_before = True if esb_data_before else False
                esbConfigModels.update_service_by_service_id_name(db_site=data, service_id=service_id, esb_service_name=request_json["esbSvcName"], new_service_id=request_json["newServiceId"])
                esb_data_after = esbConfigModels.find_service_by_service_id_name(db_site=data, service_id=request_json["newServiceId"], esb_service_name=request_json["esbSvcName"])
                esb_status_after = True if esb_data_after else False
                result.append({
                    "siteDBESB" : data,
                    "esbDataBefore" : esb_data_before,
                    "esbStatusBefore" : esb_status_before,
                    "esbDataAfter" : esb_data_after,
                    "esbStatusAfter" : esb_status_after
                })

            return generateResp.success(respBody=result)

        except ValueError as why:
            current_app.logger.warning(repr(why))
            return generateResp.badRequest(exceptionMessage=repr(why))
        except Exception as why:
            current_app.logger.warning(repr(why))
            return generateResp.generalError(exceptionMessage=repr(why))