from app import app
import config.environment as env


if __name__ == "__main__":
    app.run(host=env.APP_HOST, port=env.APP_PORT, debug=True, threaded=True)
