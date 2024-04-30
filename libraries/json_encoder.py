import datetime, json
from decimal import Decimal


class JSONEncoderHelpers(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime.datetime, datetime.date)):
            return obj.isoformat()
        elif isinstance(obj, int):
            return int(obj)
        elif isinstance(obj, (float, Decimal)):
            return float(obj)
        else:
            return super().default(obj)
