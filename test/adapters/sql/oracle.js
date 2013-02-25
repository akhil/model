var utils = require('utilities')
  , model = require('../../../lib')
  , Adapter = require('../../../lib/adapters/sql/oracle').Adapter
  , generator = require('../../../lib/generators/sql')
  , adapter
  , assert = require('assert')
  , currentId
  , tests
  , Zooby = require('../../fixtures/zooby').Zooby
  , User = require('../../fixtures/user').User
  , Profile = require('../../fixtures/profile').Profile
  , Account = require('../../fixtures/account').Account
  , shared = require('../shared');

tests = {
  'before': function (next) {
    var sql;

    adapter = new Adapter({
      database: 'hborod',
      hostname: "hborod.homebox.com",
      user: "unit_test_owner",
      password: "unit12345"
    });
    adapter.once('connect', function () {
      var sql = generator.createTable(['Zooby',
          'User', 'Profile', 'Account']);
      adapter.exec(sql, function (err, data) {
        if (err) {
          throw err;
        }
        next();
      });
    });
    adapter.connect();

    model.adapters = {
      'Zooby': adapter
    , 'User': adapter
    , 'Profile': adapter
    , 'Account': adapter
    };

  }

, 'after': function (next) {
    adapter.once('disconnect', function () {
      next();
    });
    adapter.disconnect();
  }

, 'test create adapter': function () {
    assert.ok(adapter instanceof Adapter);
  }

, 'test exec': function (next) {
    adapter.exec('select count(*) from tab',
        function (err, data) {
      if (err) {
        throw err;
      }
      next();
    });
  }

/*
, 'test save new, auto-increment id': function (next) {
    var u = User.create({
      login: 'asdf'
    , password: 'zerb'
    , confirmPassword: 'zerb'
    });
    u.save(function (err, data) {
      if (err) {
        throw err;
      }
      currentId = u.id;
      next();
    });
  }

, 'test first via auto-increment id': function (next) {
    User.first(currentId, {}, function (err, data) {
      if (err) {
        throw err;
      }
      assert.equal(data.id, currentId);
      next();
    });
  }

, 'test remove, auto-increment id': function (next) {
    Zooby.remove(currentId, {}, function (err, data) {
      if (err) {
        throw err;
      }
      Zooby.first(currentId, {}, function (err, data) {
        if (err) {
          throw err;
        }
        assert.ok(!data);
        next();
      });
    });
  }
*/


};

for (var p in shared) {
  tests[p + ' (Oracle)'] = shared[p];
}

module.exports = tests;
