from app import app
from signin import signin
from login import loginn

app.register_blueprint(loginn,url_prefix='/')
app.register_blueprint(signin,url_prefix='/')

if __name__ == '__main__':
    app.run(debug=True)