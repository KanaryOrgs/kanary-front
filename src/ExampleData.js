// Example pod data as fetched from the backend
const podData = [
    {
      "name": "nginx1",
      "namespace": "nginx",
      "images": [
        "nginx1"
      ],
      "ip": "10.244.171.98",
      "status": "Running",
      "labels": {
        "run": "nginx"
      },
      "cpu_capacity": 19,
      "ram_capacity": 33,
      "restarts": 0
    },
    {
      "name": "nginx2",
      "namespace": "nginx",
      "images": [
        "nginx"
      ],
      "ip": "10.244.171.23",
      "status": "Running",
      "labels": {
        "run": "nginx"
      },
      "cpu_capacity": 3,
      "ram_capacity": 12,
      "restarts": 0
    },
    {
      "name": "nginx3",
      "namespace": "nginx",
      "images": [
        "nginx"
      ],
      "ip": "10.244.171.19",
      "status": "Running",
      "labels": {
        "run": "nginx"
      },
      "cpu_capacity": 9,
      "ram_capacity": 15,
      "restarts": 0
    },
    {
      "name": "nginx-default",
      "namespace": "default",
      "images": [
        "nginx"
      ],
      "ip": "10.244.171.69",
      "status": "Running",
      "labels": {
        "run": "nginx"
      },
      "cpu_capacity": 4,
      "ram_capacity": 7,
      "restarts": 0
    },
    {
      "name": "httpbin",
      "namespace": "default",
      "images": [
        "kennethreitz/httpbin"
      ],
      "ip": "10.244.171.68",
      "status": "Pending",
      "labels": {
        "run": "pod"
      },
      "cpu_capacity": 8,
      "ram_capacity": 15,
      "restarts": 0
    },
    {
      "name": "calico-kube-controllers-7c968b5878-frgdz",
      "namespace": "kube-system",
      "images": [
        "docker.io/calico/kube-controllers:v3.26.4"
      ],
      "ip": "10.244.171.66",
      "status": "Running",
      "labels": {
        "k8s-app": "calico-kube-controllers",
        "pod-template-hash": "7c968b5878"
      },
      "cpu_capacity": 8,
      "ram_capacity": 15,
      "restarts": 0
    },
    {
      "name": "calico-node-cccq9",
      "namespace": "kube-system",
      "images": [
        "docker.io/calico/node:v3.26.4"
      ],
      "ip": "10.10.0.118",
      "status": "Running",
      "labels": {
        "controller-revision-hash": "7489b54556",
        "k8s-app": "calico-node",
        "pod-template-generation": "1"
      },
      "cpu_capacity": 8,
      "ram_capacity": 12,
      "restarts": 0
    },
    {
      "name": "calico-node-xnwt5",
      "namespace": "kube-system",
      "images": [
        "docker.io/calico/node:v3.26.4"
      ],
      "ip": "10.10.0.117",
      "status": "Running",
      "labels": {
        "controller-revision-hash": "7489b54556",
        "k8s-app": "calico-node",
        "pod-template-generation": "1"
      },
      "cpu_capacity": 8,
      "ram_capacity": 7,
      "restarts": 0
    },
    {
      "name": "coredns-76f75df574-tpdg5",
      "namespace": "kube-system",
      "images": [
        "registry.k8s.io/coredns/coredns:v1.11.1"
      ],
      "ip": "10.244.171.67",
      "status": "Running",
      "labels": {
        "k8s-app": "kube-dns",
        "pod-template-hash": "76f75df574"
      },
      "cpu_capacity": 2,
      "ram_capacity": 20,
      "restarts": 0
    },
    {
      "name": "coredns-76f75df574-x72z8",
      "namespace": "kube-system",
      "images": [
        "registry.k8s.io/coredns/coredns:v1.11.1"
      ],
      "ip": "10.244.171.65",
      "status": "Running",
      "labels": {
        "k8s-app": "kube-dns",
        "pod-template-hash": "76f75df574"
      },
      "cpu_capacity": 5,
      "ram_capacity": 35,
      "restarts": 0
    },
    {
      "name": "etcd-master",
      "namespace": "kube-system",
      "images": [
        "registry.k8s.io/etcd:3.5.12-0"
      ],
      "ip": "10.10.0.118",
      "status": "Running",
      "labels": {
        "component": "etcd",
        "tier": "control-plane"
      },
      "cpu_capacity": 2,
      "ram_capacity": 44,
      "restarts": 0
    },
    {
      "name": "kube-apiserver-master",
      "namespace": "kube-system",
      "images": [
        "registry.k8s.io/kube-apiserver:v1.29.4"
      ],
      "ip": "10.10.0.118",
      "status": "Running",
      "labels": {
        "component": "kube-apiserver",
        "tier": "control-plane"
      },
      "cpu_capacity": 8,
      "ram_capacity": 15,
      "restarts": 0
    },
    {
      "name": "kube-controller-manager-master",
      "namespace": "kube-system",
      "images": [
        "registry.k8s.io/kube-controller-manager:v1.29.4"
      ],
      "ip": "10.10.0.118",
      "status": "Running",
      "labels": {
        "component": "kube-controller-manager",
        "tier": "control-plane"
      },
      "cpu_capacity": 8,
      "ram_capacity": 15,
      "restarts": 1
    },
    {
      "name": "kube-proxy-ml8kc",
      "namespace": "kube-system",
      "images": [
        "registry.k8s.io/kube-proxy:v1.29.4"
      ],
      "ip": "10.10.0.117",
      "status": "Running",
      "labels": {
        "controller-revision-hash": "5fbd756bc7",
        "k8s-app": "kube-proxy",
        "pod-template-generation": "1"
      },
      "cpu_capacity": 8,
      "ram_capacity": 15,
      "restarts": 0
    },
    {
      "name": "kube-proxy-nrtqv",
      "namespace": "kube-system",
      "images": [
        "registry.k8s.io/kube-proxy:v1.29.4"
      ],
      "ip": "10.10.0.118",
      "status": "Running",
      "labels": {
        "controller-revision-hash": "5fbd756bc7",
        "k8s-app": "kube-proxy",
        "pod-template-generation": "1"
      },
      "cpu_capacity": 8,
      "ram_capacity": 15,
      "restarts": 0
    },
    {
      "name": "kube-scheduler-master",
      "namespace": "kube-system",
      "images": [
        "registry.k8s.io/kube-scheduler:v1.29.4"
      ],
      "ip": "10.10.0.118",
      "status": "Running",
      "labels": {
        "component": "kube-scheduler",
        "tier": "control-plane"
      },
      "cpu_capacity": 8,
      "ram_capacity": 15,
      "restarts": 1
    }
  ];