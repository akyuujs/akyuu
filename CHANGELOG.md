# Akyuu Changelog

<table>
<tr>
<th>Current</th>
</tr>
<tr>
<td>
<a href="#0.5.1">0.5.1</a><br />
<a href="#0.5.0">0.5.0</a><br />
<a href="#0.4.0">0.4.0</a><br />
<a href="#0.3.0">0.3.0</a><br />
</td>
</tr>
</table>

<a id="0.5.1"></a>
## 2018-03-02, Version 0.5.1 (Current), @DuanPengfei

### Notable changes

* **Core**
  * Fix can't set template root and engine before `init()`.

### Commits

* [[`146512f75e`]](https://github.com/akyuujs/akyuu/commit/146512f75e308691d3db1475e6a11ef4080bb549) - akyuu: move `init()` to constructor (@XadillaX) [#38](https://github.com/akyuujs/akyuu/pull/38)


<a id="0.5.0"></a>
## 2017-10-23, Version 0.5.0 (Current), @DuanPengfei

### Notable changes

* **Cluster**
  * Add the dependency of akyuu-cluster and make logger to adapt cluster.

### Commits

* [[`2b08b1777f`](https://github.com/akyuujs/akyuu/commit/2b08b1777f6efcb2012ad0b59892be0071069cd5)] - **example**: fix jiandan page loading failed & some eslint error (@xiaoqiangsdl) [#33](https://github.com/akyuujs/akyuu/pull/33)
* [[`503a140b20`](https://github.com/akyuujs/akyuu/commit/503a140b203ae89b759a27a98684fd31b3189367)] - **service**: fix http use error (@mapleincode) [#31](https://github.com/akyuujs/akyuu/pull/31)
* [[`32417bc8a4`](https://github.com/akyuujs/akyuu/commit/32417bc8a41bff2c1e6b617e46344d53a3d9cd4a)] - **(SEMVER-MINOR) cluster, logger**: support for akyuu.startCluster() (@XadillaX) [#28](https://github.com/akyuujs/akyuu/pull/28)

<a id="0.4.0"></a>
## 2017-07-28, Version 0.4.0, @XadillaX

### Notable changes

* **Configuration**
  * add an environment variable to decide whether generate configuration file or
    not.

### Commits

* [[`2b08b1777f`](https://github.com/akyuujs/akyuu/commit/2b08b1777f6efcb2012ad0b59892be0071069cd5)] - **(SEMVER-MINOR) config**: add an env var to generate config or not (XadillaX) [#25](https://github.com/akyuujs/akyuu/pull/25)

<a id="0.3.0"></a>
## 2017-07-11, Version 0.3.0, @XadillaX

### Notable changes

* **Service Loader**
  * Use class name as the service name with underline when `get()` and
    `getClass()`.

### Commits

* [[`c232d61841`](https://github.com/akyuujs/akyuu/commit/c232d6184147d961f4b94172e5ce9bd27e742654)] - **(SEMVER-MINOR) loader/service**: use class name as the service name (Duan Pengfei) [#18](https://github.com/akyuujs/akyuu/pull/18)
* [[`8559ae4ae2`](https://github.com/akyuujs/akyuu/commit/8559ae4ae2dc6ea80e117238401a8d7b832ec1fd)] - **github**: add issue and pull request templates (XadillaX) [#22](https://github.com/akyuujs/akyuu/pull/22)
